<script>
import Button from "@components/buttons.component.svelte";
import FormErrors from "@components/form-errors.svelte";
import {object, string} from "yup";
import {extractValidationErrors} from "@helpers/validation";
import {createEventDispatcher} from "svelte";
const dispatch = createEventDispatcher();

export let formTitle = 'Add new address';
const countries = [
    {name: 'Cyprus', slug: 'cyprus'},
    {name: 'Greece', slug: 'greece'},
    {name: 'United Kingdom', slug: 'uk'},
];
const schema = object({
    firstName: string().required('First name is required.'),
    lastName: string().required('Last name is required.'),
    street: string().required('Street is required.'),
    city: string().required('City is required.'),
    company: string().required('Company is required.'),
    country: string().required('Country is required.'),
    region: string().required('Region is required.'),
    postCode: string().required('Post code is required.'),
    phone: string().required('Phone is required.'),
});
let errors = {};
const defaultModel = {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    country: countries[0].slug,
    region: '',
    postCode: '',
    phone: '',
};
export let model = {};
model = {...model, ...defaultModel};

async function validate() {
    errors = {};
    try {
        await schema.validate(model, {abortEarly: false});
    } catch (e) {
        errors = extractValidationErrors(e);
        return;
    }

    dispatch('formValid', model);
}
</script>
<FormErrors errors={errors}/>
<form on:submit|preventDefault={validate}>
    <div class="mt-10 border-t border-gray-200 pt-10">
        <h2 class="text-lg font-medium text-gray-900">{formTitle}</h2>

        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
                <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.firstName} bind:value={model.firstName} placeholder="Name"
                           type="text" id="first-name" name="first-name" autocomplete="given-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>


            <div>
                <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.lastName} bind:value={model.lastName} placeholder="Surname"
                           type="text" id="last-name" name="last-name" autocomplete="family-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="sm:col-span-2">
                <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
                <div class="mt-1">
                    <input bind:value={model.company} placeholder="Company name" class:border-red-600={errors.company}
                           type="text" name="company" id="company" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="sm:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.street} bind:value={model.street} placeholder="Street address"
                           type="text" name="address" id="address" autocomplete="street-address" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="sm:col-span-2">
                <label for="apartment" class="block text-sm font-medium text-gray-700">Apartment, suite, etc.</label>
                <div class="mt-1">
                    <input bind:value={model.apartment} placeholder="Apartment, suite, etc."
                           type="text" name="apartment" id="apartment" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div>
                <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.city} bind:value={model.city} placeholder="City"
                           type="text" name="city" id="city" autocomplete="address-level2" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div>
                <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                <div class="mt-1">
                    <select class:border-red-600={errors.country} bind:value={model.country}
                            id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        {#each countries as country}
                        <option value={country.slug}>{country.name}</option>
                            {/each}
                    </select>
                </div>
            </div>

            <div>
                <label for="region" class="block text-sm font-medium text-gray-700">State / Province</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.region} bind:value={model.region} placeholder="State / Province"
                           type="text" name="region" id="region" autocomplete="address-level1" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div>
                <label for="postal-code" class="block text-sm font-medium text-gray-700">Postal code</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.postCode} bind:value={model.postCode} placeholder="Postal code"
                           type="text" name="postal-code" id="postal-code" autocomplete="postal-code" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>

            <div class="sm:col-span-2">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <div class="mt-1">
                    <input class:border-red-600={errors.phone} bind:value={model.phone} placeholder="Phone number"
                           type="text" name="phone" id="phone" autocomplete="tel" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
            </div>
        </div>
    </div>
    <Button type="submit" color="black">Continue</Button>
</form>
