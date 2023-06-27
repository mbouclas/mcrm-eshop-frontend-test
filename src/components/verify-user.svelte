<script lang="ts">
    import {onMount} from "svelte";
    import {loadFiltersFromUrl} from "@helpers/general";
    import {httpLoading} from "@stores/http.store";
    import Spinner from "@components/loading-spiner.svelte";
    import {UserService} from "@services/user.service";

    let isValid = true,
    token;

    onMount(async () => {
        const params = loadFiltersFromUrl(location.search[0] === '?' ? location.search.substring(1) : location.search);
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const key = Object.keys(param)[0];
            if (key === 'token') {
                isValid = true;
                token = param[key];
                break;
            }
        }

        if (!token) {
            isValid = false;
            return;
        }

        const res = await (new UserService()).verifyToken(token);

        if (!res || !res.success) {
            isValid = false;
            return;
        }

        isValid = true;
        setTimeout(() => {
            location.href = '/user';
        }, 3000);

    });
</script>
<div class="max-w-5xl mx-auto justify-center items-center my-6">
    {#if $httpLoading}

        Please wait <Spinner/>
    {/if}

    {#if !isValid}


    <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">There was an error while verifying your account</h3>
                <div class="mt-2 text-sm text-red-700">
                    Invalid or expired url
                </div>
            </div>
        </div>
    </div>
{:else}

    <div class="rounded-md bg-green-50 p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">Account Verified</h3>
                <div class="mt-2 text-sm text-green-700">
                    <p>You will be redirected automatically to the login page</p>
                </div>
                <div class="mt-4">
                    <div class="-mx-2 -my-1.5 flex">
                        <a href="/user" class="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">Go to the login page</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
</div>

