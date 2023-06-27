document.addEventListener('alpine:init', () => {
    Alpine.store('global', {
        sessId: null,
        baseUrl: '',
        user: {},
        init() {

        }
    });

    Alpine.store('user', {
        user: null,
        success:false,
        forgotPasswordConfirmSuccess:false,
        init() {
            let storedUser = localStorage.getItem('user');
            if (!storedUser || typeof storedUser === 'undefined') {
                return;
            }

            if (storedUser) {
                storedUser = JSON.parse(storedUser);
            }

            if (storedUser.accessTokenExpiresAt) {
                const expiresAt = new Date(storedUser.accessTokenExpiresAt);
                const now = new Date();

                if (expiresAt < now) {
                    this.clear();
                    return;
                }
            }
            if (storedUser.accessToken) {
                this.setUser(storedUser, true);
            }
        },

        setUser(user, fromCache = false) {
            this.user = (!fromCache) ? {
                firstName: user.user.firstName,
                lastName: user.user.lastName,
                accessToken: user.accessToken,
                accessTokenExpiresAt: user.accessTokenExpiresAt,
                refreshToken: user.refreshToken,
                refreshTokenAt: user.refreshTokenAt,
            }: user;
            localStorage.setItem('user', JSON.stringify(this.user));
        },
        clear() {
            this.user = null;
            localStorage.removeItem('user');
        },
    });

    Alpine.data('app', () => ({
        init() {
            const allData = JSON.parse(this.$refs.initialState.value);
            this.$store.cart.baseUrl = allData.baseCartUrl;
            this.$store.global.baseUrl = allData.baseUrl;
            this.$store.cart.update();
        },
        logout() {

            this.$store.user.clear();
            window.location.href = '/';
        },
    }));

});
