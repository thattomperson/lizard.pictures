<Group
  location={location}
  rotation={[10, 0, 0 ]}
>
  <Mesh
    geometry={cone(1,3)}
    scale={[0.1, 0.3, 0.1]}
    location={[0, .2, 0]}
    rotation={[180,0,0]}
    uniforms={{color: 0xf9de6b}}
  />
  <Group location={[0,y,0]}>
    <Mesh
      geometry={sphere()}
      scale={0.05}
      location={[0, .3, 0]}
      uniforms={{color: 0xffffff, emissive: color}}
    />
    <PointLight
      color={color}
      location={[0, .3, 0]}
      intensity={intensity}
    />
  </Group>
</Group>


<script>
import { onMount } from 'svelte'
import { Mesh, cone, sphere, PointLight, Group } from '@sveltejs/gl'
import { hardLight } from 'color-blend'

let intensity = 1

let color = 0xff0000

const yellow = {r: 0xf9, g: 0xde, b: 0x6b, a: .3}
const red = {r: 0xfc, g: 0xcc, b: 0x50, a: 1}
const white = {r: 0xff, g: 0xff, b: 0xff, a: .3}

let y = 0

const c = (c) => [((c.r<<16) + (c.g<<8) + c.b), c.a]

$: console.log(color, intensity)

onMount(() => {
  let frame;

  const loop = () => {
    frame = requestAnimationFrame(loop);
    [color, intensity] = c(hardLight(
      {...yellow},
      {...white}
    ))


    y = .03 * Math.sin(Date.now() * 0.0004)

    // intensity = Math.min(.5, intensity)
  };

  loop();

  return () => cancelAnimationFrame(frame);
});

export let location = [0,0,0]
</script>