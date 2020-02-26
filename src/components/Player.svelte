
<script>
import { get_scene } from '@sveltejs/gl/internal/index.mjs';
import { Group, Target, PerspectiveCamera, Mesh, sphere } from '@sveltejs/gl'
import { onMount } from 'svelte'

export let location = new Float32Array([1, 1, 2])
export let rotation = 0;
export let connections = []

$: targetLocation = new Float32Array([Math.cos(rotation), 0, Math.sin(rotation)])

let walking = false


function translate(location, d, r) {
  return new Float32Array([(d * Math.cos(rotation)) + location[0], location[1], (d * Math.sin(rotation)) + location[2]])
}

function handle_keydown(e) {
  
  if (e.keyCode === 87 /* wW */) {
    walking = true
  }
}

function handle_keyup(e) {
  if (e.keyCode === 87 /* wW */) {
    walking = false
  }
}

function handle_mousemove(e) {
  rotation += e.movementX / 50;
}

// TODO check we're not inside a group?
const scene = get_scene();


scene.canvas.addEventListener('mousedown', () => {
  scene.canvas.requestPointerLock()
})

document.addEventListener('pointerlockchange', (e) => {
  console.log(e, document.pointerLockElement === scene.canvas)
  if (document.pointerLockElement === scene.canvas) {
    document.addEventListener('mousemove', handle_mousemove, false)
    document.addEventListener('keydown', handle_keydown, false)
    document.addEventListener('keyup', handle_keyup, false)
  } else {
    document.removeEventListener('mousemove', handle_mousemove, false)
    document.removeEventListener('keydown', handle_keydown, false)
    document.removeEventListener('keyup', handle_keyup, false)
  }
})

onMount(() => {
  let frame;

  const loop = () => {
    frame = requestAnimationFrame(loop);
    
    if (walking) {
      location = translate(location, 0.1, rotation)
      Object.values(connections).forEach(c => c.send('unreliable', window.btoa(JSON.stringify(location))))
    }
  };

  loop();

  return () => cancelAnimationFrame(frame);
});

</script>


<Group location={location}>
  <Mesh
    geometry={sphere()}
  />
  <Target id="target" location={targetLocation} />
  <PerspectiveCamera location={[0,0,0]} lookAt="target" near={0.01} far={1000}/>
</Group>

