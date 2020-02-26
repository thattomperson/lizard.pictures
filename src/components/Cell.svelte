
<Group
  location={[x*2,0,y*2]}
>

  <!-- Floor -->
  <Mesh
    geometry={plane()}
    location={[0,0,0]}
    rotation={[270,0,0]}
    scale={1}
    uniforms={MuddyGrass}
  />

  <!-- Roof -->
  <!-- <Mesh
    geometry={plane()}
    location={[0,2,0]}
    rotation={[90,0,0]}
    scale={1}
    uniforms={{ color: 0xffffff }}
  /> -->

  <!-- North -->
  {#if north}
  <Mesh
    geometry={plane()}
    location={[0,1,-1]}
    rotation={[0,0,0]}
    scale={1}
    uniforms={MossyStone}
  />
  {/if}
  {#if light}
  <FireTorch location={[0,1,-1]}/>
  {/if}

  <!-- South -->
  {#if south}
  <Mesh
    geometry={plane()}
    location={[0,1,1]}
    rotation={[180,0,0]}
    scale={1}
    uniforms={MossyStone}
  />
  {/if}

  <!-- east -->
  {#if east}
  <Mesh
    geometry={plane()}
    location={[1,1,0]}
    rotation={[0,270,0]}
    scale={1}
    uniforms={MossyStone}
  />
  {/if}

  <!-- west -->
  {#if west}
  <Mesh
    geometry={plane()}
    location={[-1,1,0]}
    rotation={[180,270,0]}
    scale={1}
    uniforms={MossyStone}
  />
  {/if}

</Group>

<script>
  import Torch from './Torch.svelte'
  import FireTorch from './FireTorch.svelte'
  import { Mesh, plane, Group, Texture } from '@sveltejs/gl'
  import { MuddyGrass, MossyStone } from '../textures'

  export let light = false

  export let x
  export let y

  export let north = false
  export let south = false
  export let east = false
  export let west = false
</script>