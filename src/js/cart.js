document.addEventListener('alpine:init', () => {
    Alpine.store('cart', {
        init() {

        },
        async update(cart) {
            for (let key in cart) {
                this[key] = cart[key];
            }
        },

        baseUrl: '',
        total: 0,

        items: [],
    });

    Alpine.data('cart', () => ({
        loading: false,
        async init() {
            const localSess = localStorage.getItem('sessId');
            if (!this.$store.global.sessId && localSess) {
                this.$store.global.sessId = localSess;
            }

            this.loading = true;
            const res = await fetch(`${this.$store.cart.baseUrl}get`, {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    'x-sess-id': this.$store.global.sessId
                }
            });

            this.$store.cart.update(await res.json());
            this.loading = false;
            if (!this.$store.global.sessId) {
                this.$store.global.sessId = res.headers.get('x-sess-id');
                localStorage.setItem('sessId', this.$store.global.sessId);
            }
        },
        async clear() {
            this.loading = true;
            const res = await fetch(`${this.$store.cart.baseUrl}clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sess-id': this.$store.global.sessId,
                },
                credentials: "include",
            });

            this.$store.cart.update(await res.json());
            this.loading = false;
        },
        async removeItem(id) {
            this.loading = true;
            const res = await fetch(`${this.$store.cart.baseCartUrl}${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sess-id': this.$store.global.sessId,
                },
                credentials: "include",
            });

            this.$store.cart.update(await res.json());
            this.loading = false;
        },
    }));

    Alpine.data('cartButton', () => ({
        open: false,
        loading: false,

        init() {

        },

        async addItem(id, quantity = 1) {

            const data = {
                id,
                quantity
            };
            this.loading = true;

            const res = await fetch(`${this.$store.cart.baseUrl}add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sess-id': this.$store.global.sessId,
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            this.$store.cart.update(await res.json());
            this.loading = false;
        }
    }));


});
