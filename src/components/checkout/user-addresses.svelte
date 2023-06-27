<script lang="ts">
    export let addresses = [];
    export let selectedContact = null;
</script>

{#each addresses as address}
    <div>
        {#if address.default}
            <p>Default address</p>
        {/if}
        <label
                on:click={() => selectedContact = address}
                class:border-transparent={selectedContact === address}
                class:ring-2={selectedContact === address}
                class:ring-indigo-500={selectedContact === address}
                class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none mb-4">
            <input type="radio" name="delivery-method" value="Standard" class="sr-only" aria-labelledby="delivery-method-0-label" aria-describedby="delivery-method-0-description-0 delivery-method-0-description-1">
            <span class="flex flex-1">
                    <span class="flex flex-col">
                      <span id="delivery-method-0-label" class="block text-sm font-medium text-gray-900">{address.firstName} {address.lastName}</span>
                      <span id="delivery-method-0-description-0" class="mt-1 flex items-center text-sm text-gray-500">
                           {address.street}, {address.city}, {address.region}, {address.country}, {address.postCode}
                      </span>
                      <span id="delivery-method-0-description-1" class="mt-6 text-sm font-medium text-gray-900">{address.phone}</span>
                    </span>
                  </span>
            <!-- Not Checked: "hidden" -->
            {#if selectedContact && selectedContact === address || !selectedContact && address.default}
                <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
            {/if}

            <span class="pointer-events-none absolute -inset-px rounded-lg border-2" aria-hidden="true"></span>
        </label>

    </div>
{/each}
