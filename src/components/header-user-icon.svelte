<script lang="ts">
    import {userStore} from "@stores/user.store";

    let url = '/login',
        title = 'Login';
    userStore.subscribe((user) => {
        if (user) {
            url = '/user';
            title = 'Dashboard';
        } else {
            url = '/login';
            title = 'Login';
        }
    });
</script>
<div>
    <a href={url} title={title}>
    <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
    >
        <circle
                cx="13.4197"
                cy="10.8738"
                r="4.37382"
                stroke="black"
                stroke-width="1.5"></circle>
        <path
                d="M5.75586 22.5005C5.75586 21.5482 5.9541 20.6053 6.33925 19.7255C6.7244 18.8457 7.28893 18.0463 8.0006 17.3729C8.71227 16.6996 9.55715 16.1654 10.487 15.801C11.4168 15.4366 12.4134 15.249 13.4199 15.249C14.4263 15.249 15.4229 15.4366 16.3528 15.801C17.2826 16.1654 18.1275 16.6996 18.8392 17.3729C19.5509 18.0463 20.1154 18.8457 20.5005 19.7255C20.8857 20.6053 21.0839 21.5482 21.0839 22.5005"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
    </svg>
    </a>
</div>
