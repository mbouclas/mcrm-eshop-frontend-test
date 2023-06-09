<script lang="ts">
    import Uppy, {debugLogger} from '@uppy/core'
    import type {UppyOptions} from '@uppy/core';
    import Dashboard from '@uppy/dashboard'
    import Webcam from "@uppy/webcam";
    import RemoteSources from '@uppy/remote-sources'
    import ImageEditor from '@uppy/image-editor'
    import DropTarget from "@uppy/drop-target";
    import XHRUpload from "@uppy/xhr-upload";
    import Url from '@uppy/url';
    import GoldenRetriever from '@uppy/golden-retriever';
    import '@uppy/core/dist/style.css';
    import '@uppy/dashboard/dist/style.css';
    import '@uppy/webcam/dist/style.css';
    import '@uppy/image-editor/dist/style.min.css';
    import "@uppy/audio/dist/style.css";
    import Audio from "@uppy/audio";
    import {createEventDispatcher, onMount} from "svelte";
    const dispatch = createEventDispatcher();

    let uppyDashboard;
    export let uploaders = [
        'local'
    ], id = 'uploader',
        buttonTitle = 'Upload',
        webCamModes = [
            'video-audio',
            'video-only',
            'audio-only',
            'picture'
        ],
        closeAfterFinish = false,
        autoProceed = true,
        meta = {}
    ;

    export function close() {
        uppyDashboard.setState({files: []});

    }
    export let options: UppyOptions = {};
    onMount(() => {

        const companionUrl = `${import.meta.env.PUBLIC_BASE_URL}companion`;
        uppyDashboard = new Uppy({
                logger: debugLogger,
                meta,
                id,
                autoProceed,
                restrictions: {
                    maxNumberOfFiles: 10,
                    allowedFileTypes: ['image/*', '.pdf']
                },
                onBeforeUpload: (files) => {
                    uppyDashboard.setFileMeta({...{}, ...meta});
                    return files;
                },
            });

        uppyDashboard.use(Dashboard, {
                    inline: false,
                    // target: '#uploader',
                    trigger: `#trigger-${id}`,
                    showProgressDetails: true,
                    proudlyDisplayPoweredByUppy: false,
                    closeAfterFinish,
                });

        uppyDashboard.use(ImageEditor, {target: Dashboard});
        uppyDashboard.use(DropTarget, {
                    target: document.body
                });
        uppyDashboard.use(XHRUpload, {
                    endpoint: `${import.meta.env.PUBLIC_BASE_URL}upload/file`,
                    limit: 6,
                    bundle: true,
                    withCredentials: true,
                    formData: true,
                });

        uppyDashboard.use(GoldenRetriever);

        if (uploaders.indexOf('webcam') !== -1) {
            uppyDashboard.use(Webcam, {
                target: Dashboard,
                showVideoSourceDropdown: true,
                modes: webCamModes,
                videoConstraints: {
                    facingMode: 'environment'
                }
            });
        }

        if (uploaders.indexOf('audio') !== -1) {
            uppyDashboard.use(Audio, {
                target: Dashboard,
            });
        }

        if (uploaders.indexOf('url') !== -1) {
            uppyDashboard.use(Url, {
                target: Dashboard,
                companionUrl,
            });
        }

        if (uploaders.indexOf('remoteSources') !== -1) {
            uppyDashboard.use(RemoteSources, {
                companionUrl ,
                sources: ['Url', 'GoogleDrive']
            });
        }


        window['uppy'] = uppyDashboard;

        uppyDashboard.on("complete", (result) => {
            if (result.failed.length > 0) {
                dispatch('uploadFailed', {id, res: result.failed});
                return;
            }

            dispatch('allUploadsComplete', {id, res: result});
        });

        uppyDashboard.on('upload-success', (file, response) => {
            dispatch('uploadComplete', {id, file, response});
        });
    });
</script>

<button type="button" id={`trigger-${id}`}
        class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/70">{buttonTitle}</button>


<main id="uploader" class="min-h-[150px]"></main>

