<script lang="ts">
	import firebase from "./firebase";
	import authStore from "./auth";

	let name = "world";

	authStore.subscribe((state: any) => {
		if (state == null || state.user == null) {
			name = "unknown";
		} else {
			name = state.user.displayName;
		}
	});
</script>

<h1>Hello {name}!</h1>
