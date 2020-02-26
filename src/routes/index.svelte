<script>
	import { onMount } from 'svelte';

  let MyComponent;

  onMount(async () => {
		const module = await import('../components/Game.svelte');
		MyComponent = module.default;
	});

</script>

<svelte:component this={MyComponent}/>