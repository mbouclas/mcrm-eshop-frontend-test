<script lang="ts">
    import {cart, saveCartToServerAction, setCartItems, setMetaDataAction} from "@stores/cart.store";
    import type {ICartItem} from "@stores/cart.store";
    import type {IEvent} from "@models/general";
    import type {SuccessResponse, UploadResult, UppyFile} from "@uppy/core";
    import FileUploader from '@components/file-uploader.svelte';
    import Button from "@components/buttons.component.svelte";
    import {createEventDispatcher} from "svelte";
    import { object, string} from 'yup';
    import {extractValidationErrors} from "@helpers/validation";
    import Spinner from '@components/loading-spiner.svelte';
    import {httpLoading} from "@stores/http.store";

    const schema = object({
        description: string().required('Please provide a description for this file'),
    });
    const dispatch = createEventDispatcher();
    const cartItemUploadIdPrefix = 'upload-';
    let cartItems: ICartItem[] = [],
        uploadedFiles: UppyFile<Record<string, unknown>, Record<string, unknown>>[] = [],
        showUploader = true,
        uploaders = {},
        validationErrors = {},
    HttpLoading = false;

    cart.subscribe((cart) => {
        cartItems = cart.items || [];
    });

    httpLoading.subscribe((loading) => {
        HttpLoading = loading;
    });

    function uploadComplete(e: IEvent<{id: string, file: UppyFile<Record<string, unknown>, Record<string, unknown>>, response: SuccessResponse}>) {
        const idx = parseInt(e.detail.id.replace(cartItemUploadIdPrefix, ''));
        if (!cartItems[idx].metaData) {
            cartItems[idx].metaData = {};
        }
        if (!cartItems[idx].metaData.uploadedFiles) {
            cartItems[idx].metaData.uploadedFiles = [];
        }

        const uploadResponse = e.detail.response.body.find((item) => item.originalName === e.detail.file.name);

        const file = {
            description: '',
            filename: uploadResponse.filename,
            originalName: uploadResponse.originalName,
            id: e.detail.file.id,

        }

        cartItems[idx].metaData.uploadedFiles.push(file);
        validationErrors[`${idx}-${cartItems[idx].metaData.uploadedFiles.length - 1}`] = '';
        setMetaDataAction(idx, cartItems[idx].metaData);
    }

    function onAllUploadsComplete(e: IEvent<{id: string, res: UploadResult<Record<string, unknown>>}>) {
        uploadedFiles = e.detail.res.successful;
        showUploader = false;
        // uploaders[e.detail.id.replace(cartItemUploadIdPrefix, '')].close();

    }

    function onUploadFailed(e: IEvent<{id: string, res: UploadResult<Record<string, unknown>>}>) {
        const failure = e.detail.res.failed;
    }

    async function handleDone() {
        validationErrors = {};
        // validate the description fields
        cartItems.forEach((item, cartIdx) => {

            if (!item.metaData || !Array.isArray(item.metaData.uploadedFiles)) {
                return;
            }

            item.metaData.uploadedFiles.forEach((file, idx) => {
                try {
                    schema.validateSync(file, {abortEarly: false});
                } catch (e) {
                    const errors = extractValidationErrors(e);
                    validationErrors[`${cartIdx}-${idx}`] = errors['description'];
                }

            });
        });

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setCartItems(cartItems);
        //update cart with the new metadata
        await saveCartToServerAction();
        dispatch('attachFilesDone');
    }

    function removeUpload(cartIdx: number, fileIdx: number) {
        cartItems[cartIdx].metaData.uploadedFiles.splice(fileIdx, 1);
        setMetaDataAction(cartIdx, cartItems[cartIdx].metaData);
    }

</script>
<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gray-50 shadow-2xl p-8 rounded">
{#each cartItems as item, idx}

    <div class="col-span-full mb-4">

        <label for="photo" class="block text-sm font-medium leading-6 ">{item.title}
            {#if item.metaData}
                {#if item.metaData.color}
                    | {item.metaData.color.name}
                {/if}
            {/if}
        </label>
        <div class="mt-2 flex items-center gap-x-3">
            <img src={item.thumb} alt={item.title} class="w-20 rounded-md">
            <FileUploader id={`${cartItemUploadIdPrefix}${idx}`} on:uploadComplete={uploadComplete} on:allUploadsComplete={onAllUploadsComplete} on:uploadFailed={onUploadFailed}
                webCamModes={['picture']} uploaders={['webcam']} bind:this={uploaders[idx]} buttonTitle="Attach Logo"  />
        </div>

        {#if Array.isArray(item.metaData.uploadedFiles) && item.metaData.uploadedFiles.length > 0}

        <div class="grid grid-cols-2">
            {#each item.metaData.uploadedFiles as file, index}
                <div class="">
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">{file.originalName}</label>
                    <div class="mt-2">
                        <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input name={`description-${index}`} bind:value={file.description}
                                   class:border-red-600={validationErrors[`${idx}-${index}`]}
                                    type="text"  class="block flex-1  bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                   placeholder="Describe this file *">

                        </div>
                        {#if validationErrors[`${idx}-${index}`]}
                            <p class="text-red-500 text-sm">{validationErrors[`${idx}-${index}`]}</p>
                        {/if}
                    </div>
                </div>

                <p class="mt-3 text-sm leading-6 text-gray-600 text-right">
                <button on:click={removeUpload.bind(this, idx, index)}
                        class="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                </svg></button>
                </p>
            {/each}


        </div>
            {/if}
    </div>
{/each}



<Button color="primary" onClickHandler={handleDone} disabled={HttpLoading}>
    {#if HttpLoading}
        <Spinner color="white"  />
        {:else}
        Done
        {/if}
    </Button>
</div>

