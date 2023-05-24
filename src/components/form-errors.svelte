<script lang="ts">
    import Alert from '@components/alerts.component.svelte';
    export let errors = {};

</script>
{#if Object.keys(errors).length > 0}
    <Alert type="error">
        <h2 slot="header">Errors</h2>
        {#each Object.entries(errors) as error}
            <p class="text-red-500 text-xs italic">{error}</p>
        {/each}
    </Alert>
{/if}
