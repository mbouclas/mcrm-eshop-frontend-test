document.addEventListener("alpine:init", () => {
  Alpine.data("userForm", () => ({
    submitted: false,
    loading: false,
    valid: false,
    init() {},
  }))

  Alpine.data("user", () => ({
    baseUrl: "",
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    password: null,
    newPassword: null,
    token: null,
    rememberMe: false,
    error: null,
    loginInPlace: false,
    registerInPlace: false,
    forgotPasswordInPlace: false,
    success:false,
    init() {
      console.log("user started")
      if (
        this.$refs.loginForm &&
        this.$refs.loginForm.dataset &&
        this.$refs.loginForm.dataset.inplace
      ) {
        this.loginInPlace = this.$refs.loginForm.dataset.inplace === "true"
      }
      if (
        this.$refs.registerForm &&
        this.$refs.registerForm.dataset &&
        this.$refs.registerForm.dataset.inplace
      ) {
        this.registerInPlace =
          this.$refs.registerForm.dataset.inplace === "true"
      }
      if (
        this.$refs.forgotPasswordForm &&
        this.$refs.forgotPasswordForm.dataset &&
        this.$refs.forgotPasswordForm.dataset.inplace
      ) {
        this.forgotPasswordInPlace =
          this.$refs.forgotPasswordForm.dataset.inplace === "true"
      }
      this.baseUrl = this.$store.global.baseUrl
    },
    async login() {
      // Get the form data
      // validate the form
      // post to endpoint
      this.loading = true
      const headers = new Headers()
      headers.append("Content-Type", "application/x-www-form-urlencoded")
      headers.append("Authorization", "Basic YWRtaW5BcHA6dG9wU2VjcmV0")
      headers.append("credentials", "same-origin")

      const urlencoded = new URLSearchParams()
      urlencoded.append("username", this.username)
      urlencoded.append("password", this.password)
      urlencoded.append("rememberMe", this.rememberMe)
      urlencoded.append("grant_type", "password")

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
      }
      const res = await fetch(`${this.baseUrl}oauth/token`, requestOptions)
      const response = await res.json()
      if (!response.accessToken) {
        //errors
        this.error = response.reason ?? response.reason
        return
      }

      // set the global state
      this.$store.user.setUser(response)

      this.loading = false
      window.location.href = '/'
      if (this.loginInPlace) {
        return
      }

      // redirect to the last location
    },
    async register() {
      this.loading = true
      const headers = new Headers()
      headers.append("Content-Type", "application/x-www-form-urlencoded")

      headers.append("credentials", "same-origin")

      const urlencoded = new URLSearchParams()
      urlencoded.append("firstName", this.firstName)
      urlencoded.append("lastName", this.lastName)
      urlencoded.append("email", this.email)
      urlencoded.append("password", this.password)
      urlencoded.append("grant_type", "password")

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
      }
      const res = await fetch(`${this.baseUrl}oauth/register`, requestOptions)
      const response = await res.json()
      if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
        //errors
        this.error = response.reason ?? response.reason
        return
      }
      this.$store.user.success = true
      this.loading = false

      if (this.registerInPlace) {
        return
      }
    },

    async forgotPassword() {
      this.loading = true
      const headers = new Headers()
      headers.append("Content-Type", "application/x-www-form-urlencoded")

      headers.append("credentials", "same-origin")

      const urlencoded = new URLSearchParams()
      urlencoded.append("email", this.email)
      urlencoded.append("password", this.newPassword)
      urlencoded.append("grant_type", "password")

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
      }
      const res = await fetch(
        `${this.baseUrl}oauth/forgot-password`,
        requestOptions
      )
      const response = await res.json()

      if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
        //errors
        this.error = response.reason ?? response.reason
        return
      }
      this.$store.user.success = true
      this.loading = false

      if (this.registerInPlace) {
        return
      }
    },
    async forgotPasswordConfirm() {
      this.loading = true
      const headers = new Headers()
      headers.append("Content-Type", "application/x-www-form-urlencoded")

      headers.append("credentials", "same-origin")

      const urlencoded = new URLSearchParams()
      urlencoded.append("token", this.token)
      urlencoded.append("password", this.newPassword)
      urlencoded.append("grant_type", "password")

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
      }
      const res = await fetch(
        `${this.baseUrl}oauth/forgot-password-confirm`,
        requestOptions
      )
      const response = await res.json()

      if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
        //errors
        this.error = response.reason ?? response.reason
        return
      }
      this.$store.user.forgotPasswordConfirmSuccess = true
      this.loading = false

      if (this.registerInPlace) {
        return
      }
    },
  }))
})
