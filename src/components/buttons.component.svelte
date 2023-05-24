<script lang="ts">
    export let onClickHandler;
    export let type: 'submit'|'button' = 'button';
    export let color = 'primary';
    let classes;

    switch (color) {
        case 'primary': {
            classes = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
        case 'secondary': {
            classes = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
        case 'black': {
            classes = 'bg-black hover:bg-gray-700 focus:ring-gray-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
        case 'gray': {
            classes = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
        case 'error': {
            classes = 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
        case 'cta': {
            classes = 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:text-gray-500 disabled:bg-gray-100';
            break;
        }
    }

    function handleClick() {
        if (typeof onClickHandler === 'function') {
            onClickHandler();
        }
    }

</script>

<button on:click={handleClick}
        type={type} class={`${classes} mt-6 w-full rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:cursor-not-allowed`}>
    <slot></slot>
</button>
