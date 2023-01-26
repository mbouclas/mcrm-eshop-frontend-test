document.addEventListener('alpine:init', () => {
    Alpine.data('userForm', () => ({
        submitted: false,
        loading: false,
        valid: false,
        init() {
        }
    }));

    Alpine.data('user', () => ({
        baseUrl: '',
        username: null,
        password: null,
        rememberMe: false,
        errors: [],
        loginInPlace: false,
        init() {
            console.log('user started')
            if (this.$refs.loginForm && this.$refs.loginForm.dataset && this.$refs.loginForm.dataset.inplace) {
                this.loginInPlace = (this.$refs.loginForm.dataset.inplace === 'true');
            }
            this.baseUrl = this.$store.global.baseUrl;

        },
        async login() {
            // Get the form data
            // validate the form
            // post to endpoint
            this.loading = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            headers.append("Authorization", "Basic YWRtaW5BcHA6dG9wU2VjcmV0");
            headers.append('credentials', 'same-origin');

            const urlencoded = new URLSearchParams();
            urlencoded.append("username", this.username);
            urlencoded.append("password", this.password);
            urlencoded.append("rememberMe", this.rememberMe);
            urlencoded.append("grant_type", "password");

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: urlencoded,

            };
            const res = await fetch(`${this.baseUrl}oauth/token`, requestOptions);
            const response = await res.json();
            if (!response.accessToken) {
                //errors
                this.errors.push(res.reason.message ?? res.reason);
                return;
            }

            // set the global state
            this.$store.user.setUser(response);

            this.loading = false;


            if (this.loginInPlace) {
                return;
            }

            // redirect to the last location
        },

    }));
});
