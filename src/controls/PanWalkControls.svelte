<script>
	import * as yootils from 'yootils';
	import { debounce } from '@sveltejs/gl/controls/debounce.js';
	import { onDestroy } from 'svelte';
	import { get_scene } from '@sveltejs/gl/internal/index.mjs';
	import { normalize } from '@sveltejs/gl/internal/utils.mjs';

	// TODO check we're not inside a group?
  const scene = get_scene();

	export let location;
  export let rotation;
  
  function rotate(x, y) {
    rotation += x
  }

  function handle_keydown(event) {
    
  }

  function handle_mousedown(event) {
		let last_x = event.clientX;
		let last_y = event.clientY;

		const handle_mousemove = debounce(event => {
			const x = event.clientX;
			const y = event.clientY;

			const dx = x - last_x;
			const dy = y - last_y;

			if (event.shiftKey || event.which === 2) {
				pan(dx * 0.01, dy * 0.01);
			} else {
				rotate(dx * 0.005, dy * 0.005);
			}

			last_x = x;
			last_y = y;
		});

		function handle_mouseup(event) {
			window.removeEventListener('mousemove', handle_mousemove);
			window.removeEventListener('mouseup', handle_mouseup);
		}

		window.addEventListener('mousemove', handle_mousemove);
		window.addEventListener('mouseup', handle_mouseup);
	}

  scene.canvas.addEventListener('mousedown', handle_mousedown);
  window.addEventListener('keydown', handle_keydown);

	onDestroy(() => {
		scene.canvas.removeEventListener('mousedown', handle_mousedown);
	});
</script>

<slot {location} {rotation}></slot>