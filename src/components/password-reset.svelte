<script lang="ts">
    import FormErrors from "@components/form-errors.svelte";
    import {object, string} from 'yup';
    import {onMount} from "svelte";
    import {extractValidationErrors} from "@helpers/validation";
    import {UserService} from "@services/user.service";
    import ChangePassword from '@components/user/change-password.svelte';

    let showOtpForm = false,
        showEmailForm = true,
        showChangePasswordForm = false,
        errors = {},
        otpCode = '',
    maskedEmail;

    const model = {
        email: '',
    },
        otpLength = 6;


    const schema = object({
        email: string().email("Email doesn't look right").required('Please provide your email'),
    });

    onMount(() => {
        console.log('mounted')
    });

    async function submit() {
        errors = {};
        try {
            await schema.validate(model, {abortEarly: false});
        } catch (e) {
            errors = extractValidationErrors(e);
            return;
        }

        await sendForOtp();

    }

    async function sendForOtp() {
        const res = await (new UserService()).askForPasswordReset(model.email);
        if (!res.success && res.message === 'EMAIL_NOT_FOUND') {
            errors.email = 'Email not found';

            return
        }

        showOtpForm = true;
        showEmailForm = false;
        const regex = /(?<=.).(?=[^@]*?.@)|(?:(?<=@.)|(?!^)\G(?=[^@]*$))(.)(?=.*\.)|(?:(?<=\.)(?=[^.]+$)|(?!^)\G(?=[^@.]*$))[^.](?!$)/gm;
        maskedEmail = model.email.replace(regex, '*');
    }

    async function resendOtp() {
        await sendForOtp();
    }

    async function verifyOtpCode() {
        errors = {};

        if (otpCode.length !== otpLength) {
            errors['otp'] = 'Please enter a valid OTP code';
            return
        }
        const res = await (new UserService()).verifyPasswordResetCode(model.email, otpCode);

        if (res.success) {
            showOtpForm = false;
            showChangePasswordForm = true;
        }
    }

    function OTPInput(inputs) {

        inputs.forEach((input, index) => {
            input.addEventListener('paste', (event) => {
                //event.preventDefault();
                const text = event.clipboardData.getData('text/plain');
                const characters = text.split('');
                characters.forEach((character, index) => {
                    if (index < inputs.length) {
                        inputs[index].value = character;
                    }
                });
                otpCode = [...inputs].map(input => input.value).join('');
            });

            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
                    // Do not prevent default behavior
                }
                const ctrl = event.ctrlKey ? event.ctrlKey : event.keyCode === 17;

                if (event.key === 'Backspace') {
                    inputs[index].value = '';
                    if (index !== 0) inputs[index - 1].focus();
                } else {
                    if (index === inputs.length - 1 && input.value !== '') {
                        return true;
                    } else if (event.keyCode == 86 && ctrl) {
                    } else if (event.keyCode > 47 && event.keyCode < 58) {
                        // numbers
                        input.value = event.key;
                        if (index !== inputs.length - 1) inputs[index + 1].focus();
                        event.preventDefault();
                    } else if (event.keyCode > 64 && event.keyCode < 91) {
                        // letters
                        console.log(event.keyCode, String.fromCharCode(event.keyCode))
                        input.value = String.fromCharCode(event.keyCode);
                        if (index !== inputs.length - 1) inputs[index + 1].focus();
                        event.preventDefault();
                    }
                }


                otpCode = [...inputs].map(input => input.value).join('');
            });
        });
    }

    function addRemoveEventListeners() {
        setTimeout(() => {
            if (typeof document === 'undefined' || !document) {return}
            const inputs = document.querySelectorAll('#otp > input');
            OTPInput(inputs);
        })

    }

    function onPasswordChangeSuccess() {
        window.location.href = '/user';
    }

    $: showOtpForm && addRemoveEventListeners();


</script>

<div class="mx-auto min-h-[560px]">
    <div class="max-w-sm mx-auto md:max-w-lg">
        <div class="w-full">
            <div class="bg-white h-64 py-3 rounded text-center">
                <FormErrors errors={errors}/>
                {#if showChangePasswordForm}
                <ChangePassword on:success={onPasswordChangeSuccess} email={model.email} />
                    {/if}
                {#if showEmailForm}
                    <form class="space-y-6" method="POST" on:submit|preventDefault={submit}>
                        <h1 class="text-2xl font-bold">Reset your password</h1>
                        <div class="flex flex-col mt-4">
                            <span>Enter your email bellow to receive a reset code on your email</span>
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                            <div class="mt-1">
                                <input
                                        class:border-red-600={errors.email}
                                        bind:value={model.email}
                                        id="email"
                                        placeholder="email address"
                                        name="email"
                                        type="email"
                                        autocomplete="email"
                                        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                    type="submit"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >Get OTP code
                            </button>
                        </div>
                    </form>
                {/if}


                {#if showOtpForm}
                    <form on:submit|preventDefault={verifyOtpCode}>
                    <h1 class="text-2xl font-bold">OTP Verification</h1>
                    <div class="flex flex-col mt-4">
                        <span>Enter the OTP you received at</span>
                        <span class="font-bold">{maskedEmail}</span>
                    </div>
                    <div
                            id="otp"
                            class="flex flex-row justify-center text-center px-2 mt-5"
                    >
                        {#each Array(otpLength) as i, index}

                        <input
                                class="
                      m-2
                      border
                      h-10
                      w-10
                      text-center
                      form-control
                      rounded
                    "
                                type="text"
                                id={`input-${index}`}
                                maxlength="1"
                        />
                            {/each}
                    </div>

                    <button
                            type="submit"
                            class="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >Verify OTP code
                    </button>

                    <div class="flex justify-center text-center mt-5">
                        <a href="#" on:click|preventDefault={resendOtp}
                                class="
                      flex
                      items-center
                      text-blue-700
                      hover:text-blue-900
                      cursor-pointer
                    "
                        ><span class="font-bold">Resend OTP</span
                        ><i class="bx bx-caret-right ml-1"></i
                        ></a>
                    </div>
                    </form>
                {/if}
            </div>
        </div>
    </div>
</div>
