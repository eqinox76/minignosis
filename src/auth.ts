import { writable } from "svelte/store";
import { UserInfo, getAuth } from "firebase/auth";

const authStore = writable<{
    loggedIn: boolean,
    user?: UserInfo
}>()

export default {
    subscribe: authStore.subscribe,
    set: authStore.set,
};

getAuth().onAuthStateChanged((user) => {
    authStore.set({
        loggedIn: user !== null,
        user,
    });
});
