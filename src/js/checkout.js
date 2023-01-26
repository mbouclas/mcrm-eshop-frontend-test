document.addEventListener('alpine:init', () => {
    Alpine.data('checkout', () => ({
        payment: [],
        shipping: [],
        ready: false,
        loading: false,
        async init() {
            this.loading = true;
            const res = await fetch(`${this.$store.global.baseUrl}checkout-settings`, {
                headers: {
                    'x-sess-id': this.$store.global.sessId,
                }
            });
            const data = await res.json();

            for (let key in data) {
                this[key] = data[key];
            }

            this.ready = true;
            this.loading = false;
        },
    }));
});
