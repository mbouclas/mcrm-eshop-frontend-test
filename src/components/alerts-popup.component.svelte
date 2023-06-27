<script lang="ts">
    import {alertsStore, setAlertAction} from "@stores/http.store";
    import type {IAlertsStore} from "@models/general";
    const defaults = {
        success: {
            title: "Success",
            bgColor: "bg-emerald-500",
            color: 'text-emerald-500 dark:text-emerald-400',
            timeout: 5000
        },
        error: {
            title: "Error",
            bgColor: "bg-red-500",
            color: 'text-red-500 dark:text-red-400',
            timeout: 5000
        },
        warning: {
            title: "Warning",
            bgColor: "bg-yellow-400",
            color: 'text-yellow-400 dark:text-yellow-300',
            timeout: 5000
        },
        info: {
            title: "Info",
            bgColor: "bg-blue-500",
            color: 'text-blue-500 dark:text-blue-400',
            timeout: 5000
        }
    };
    let alert: IAlertsStore,
        position = 'bottom-right',
        positionClass;

    alertsStore.subscribe((state) => {
        if (!state.message) {
            return;
        }

        alert = state;
        position = state.position || 'bottom-right';

        switch (position) {
            case 'top':
                positionClass = 'top-7 left-1/2 transform -translate-x-1/2';
                break;
            case 'bottom':
                positionClass = 'bottom-7 left-1/2 transform -translate-x-1/2';
                break;
            case 'top-right':
                positionClass = 'top-7 right-7';
                break;
            case 'top-left':
                positionClass = 'top-7 left-7';
                break;
            case 'bottom-left':
                positionClass = 'bottom-7 left-7';
                break;
            case 'bottom-right':
                positionClass = 'bottom-7 right-7';
                break;
        }

        setTimeout(() => {
            alert = {} as IAlertsStore;
            setAlertAction({} as IAlertsStore);
        }, state.timeout || 5000);
    });
</script>

{#if alert && alert.message}
<div class={`fixed  z-10 ${positionClass}`}>
    <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div class={`flex items-center justify-center w-12 ${defaults[alert.type].bgColor}`}>
            {#if alert.type === "success"}
            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
            </svg>
                {:else if alert.type === "error"}
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
                {:else if alert.type === "warning"}
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
                </svg>
                {:else if alert.type === "info"}
                <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
                </svg>
                {:else}

                {/if}
        </div>

        <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
                <span class={`font-semibold ${defaults[alert.type].color}`}>{alert.title || defaults[alert.type].title}</span>
                <p class="text-sm text-gray-600 dark:text-gray-200">{alert.message}</p>
            </div>
        </div>
    </div>

</div>
{/if}
