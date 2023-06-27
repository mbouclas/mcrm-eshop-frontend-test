<script lang="ts">
    export let type = 'info';

    let style, textColor;
    switch (type) {
        case 'info' : style = 'bg-blue-50 border-blue-500 text-blue-700 rounded-md p-4'; textColor = 'text-blue-800'; break;
        case'success' : style = 'bg-green-50 border-green-500 text-green-700 rounded-md p-4'; textColor = 'text-green-800'; break;
        case 'error' : style = 'bg-red-50 border-red-500 text-red-700 rounded-md p-4';  textColor = 'text-red-800'; break;
    }

    $: getSvg = () => {
        if (type === 'error') {
            return `
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
      </svg>
        `
        }

        if (type === 'success') {
            return `
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            `;
        }

        if (type === 'info') {
            return `
    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
      </svg>
            `;
        }
    }
</script>

<div class={`my-6 ${style}`}>
    <div class="flex">
        <div class="flex-shrink-0">
            {@html getSvg()}
        </div>
        <div class="ml-3">
            <div class={`text-sm font-medium ${textColor}`}><slot name="header"></slot></div>

            <slot></slot>
        </div>
    </div>
</div>
