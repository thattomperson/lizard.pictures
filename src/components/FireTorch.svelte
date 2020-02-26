<Group
  location={location}
>
  <Mesh
    geometry={plane()}
    location={[0,0,1]}
    vert={vert}
    frag={frag}
    rotation={[180,270,0]}
    uniforms={{color: 0xff0000}}
  />
</Group>


<script>
import { onMount } from 'svelte'
import { Mesh, plane, PointLight, Group } from '@sveltejs/gl'
import { get_scene } from '@sveltejs/gl/internal'

import frag from '../shaders/flame.frag.glsl'
import vert from '../shaders/flame.vert.glsl'


onMount(() => {
  let frame;

  const loop = () => {
    frame = requestAnimationFrame(loop);


  };

  loop();

  return () => cancelAnimationFrame(frame);
});

export let location = [0,0,0]
</script>