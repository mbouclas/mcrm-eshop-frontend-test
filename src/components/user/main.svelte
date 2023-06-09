<script lang="ts">
    import {userStore} from "@stores/user.store";
    import type {IUserStore} from "@models/user.model";
    import Login from '@components/auth/login.svelte'
    let user: IUserStore;

    userStore.subscribe((state) => {
        console.log(state)
        user = state;
    });

    function onLoginSuccess() {

    }

    function onLoginError() {

    }

</script>



{#if !user || !user.accessToken}
    <div class="mx-auto max-w-7xl">
        <Login on:loginSuccess={onLoginSuccess} on:loginError={onLoginError} />
    </div>
    {:else}
    <div class="mx-auto max-w-7xl  lg:flex lg:gap-x-16 lg:px-8 mb-4">
        <aside class="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav class="flex-none px-4 sm:px-6 lg:px-0">
                <ul role="list" class="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                    <li>
                        <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                        <a href="#" class="bg-gray-50 text-indigo-600 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"></path></svg>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="176" cy="416" r="16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><circle cx="400" cy="416" r="16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M48 80h64l48 272h256"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128"></path></svg>
                            Quotes
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"></path><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"></path></svg>
                            Account Details
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"></path></svg>
                            Change Password
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256"></path></svg>
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <main class="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
            <div class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-500">This information will be displayed publicly so be careful what you share.</p>

                    <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                        <div class="pt-6 sm:flex">
                            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div class="text-gray-900">Tom Cook</div>
                                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                            </dd>
                        </div>
                        <div class="pt-6 sm:flex">
                            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div class="text-gray-900">tom.cook@example.com</div>
                                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                            </dd>
                        </div>
                        <div class="pt-6 sm:flex">
                            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Title</dt>
                            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div class="text-gray-900">Human Resources Manager</div>
                                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Bank accounts</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-500">Connect bank accounts to your account.</p>

                    <ul role="list" class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                        <li class="flex justify-between gap-x-6 py-6">
                            <div class="font-medium text-gray-900">TD Canada Trust</div>
                            <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                        </li>
                        <li class="flex justify-between gap-x-6 py-6">
                            <div class="font-medium text-gray-900">Royal Bank of Canada</div>
                            <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                        </li>
                    </ul>

                    <div class="flex border-t border-gray-100 pt-6">
                        <button type="button" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"><span aria-hidden="true">+</span> Add another bank</button>
                    </div>
                </div>

                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Integrations</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-500">Connect applications to your account.</p>

                    <ul role="list" class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                        <li class="flex justify-between gap-x-6 py-6">
                            <div class="font-medium text-gray-900">QuickBooks</div>
                            <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                        </li>
                    </ul>

                    <div class="flex border-t border-gray-100 pt-6">
                        <button type="button" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"><span aria-hidden="true">+</span> Add another application</button>
                    </div>
                </div>

                <div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Language and dates</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-500">Choose what language and date format to use throughout your account.</p>

                    <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                        <div class="pt-6 sm:flex">
                            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
                            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div class="text-gray-900">English</div>
                                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                            </dd>
                        </div>
                        <div class="pt-6 sm:flex">
                            <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
                            <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div class="text-gray-900">DD-MM-YYYY</div>
                                <button type="button" class="font-semibold text-indigo-600 hover:text-indigo-500">Update</button>
                            </dd>
                        </div>
                        <div class="flex pt-6">
                            <dt class="w-64 flex-none pr-6 font-medium text-gray-900" id="timezone-option-label">Automatic timezone</dt>
                            <dd class="flex flex-auto items-center justify-end">
                                <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
                                <button type="button" class="bg-gray-200 flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" role="switch" aria-checked="true" aria-labelledby="timezone-option-label">
                                    <!-- Enabled: "translate-x-3.5", Not Enabled: "translate-x-0" -->
                                    <span aria-hidden="true" class="translate-x-0 h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"></span>
                                </button>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </main>
    </div>
    {/if}

