
<script>

import { Group, Target, PerspectiveCamera, Mesh, sphere } from '@sveltejs/gl'
import { onMount } from 'svelte'

export let connection

export let location = [0,1,0]

console.log(connection)

connection.onmessage = (label, msg) => {
  location = JSON.parse(window.atob(msg.data))
}

let y = .03 * Math.sin(Date.now() * 0.0004)
onMount(() => {
  let frame;

  const loop = () => {
    frame = requestAnimationFrame(loop);
    y = .03 * Math.sin(Date.now() * 0.0004)
  };

  loop();

  return () => cancelAnimationFrame(frame);
});


</script>


<Group location={location}>
  <Mesh
    geometry={sphere()}
    scale={0.3}
    location={[0,y,0]}
    
    uniforms={{color: 0xcccccc, emissive: 0xf9f9f9, alpha: 0.6}}
  />
</Group>

