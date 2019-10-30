import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  TextureLoader,
  PlaneGeometry,
} from 'three'

import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'

import lizardImage from './lizard.gif';
const lizardTexture = new TextureLoader().load( lizardImage );
const lizardMaterial = new MeshStandardMaterial( { map: lizardTexture, metalness: 0 } );

const finishMaterial = new MeshBasicMaterial( { color: '#ff0000' } );
const startMaterial = new MeshBasicMaterial( { color: '#00ff00' } );


import concreteImage from './concrete.jpg';
const concreteTexture = new TextureLoader().load( concreteImage );
const concreteMaterial = new MeshStandardMaterial( { map: concreteTexture, metalness: 0 } );


const w = 10;
const d = 10;



const cw = 500/3;
const cd = cw;
const ch = 333/3;

const wallGeometry = new PlaneGeometry( cw, ch );
const floorGeometry = new PlaneGeometry( cw, cd );

const mazeD = cd * d;
const mazeW = cw * w;
const mazeH = ch

const renderDistance = Math.sqrt(Math.pow(mazeW, 2) + Math.pow(mazeD, 2))

var scene = new Scene();


var renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var aLight = new AmbientLight(0xffffff, .7)
scene.add( aLight );



function cell(x: number, z: number, north: boolean, south: boolean, east: boolean, west: boolean, start: boolean, finish: boolean) {
  if (north) {
    const wall = new Mesh( wallGeometry, lizardMaterial );
    wall.position.z = z * cd - (cd/2)
    wall.position.x = x * cw
    // wall.applyQuaternion(quaternion);
    scene.add( wall );
  }

  if (east) {
    const wall = new Mesh( wallGeometry,lizardMaterial);
    wall.position.z = z * cd
    wall.position.x = (x * cw) + (cw/2)
    // wall.applyQuaternion(quaternion);
    wall.rotation.y = 270 * (Math.PI/180)
    
    scene.add( wall );
  }



  
  if (south) {
    const wall = new Mesh( wallGeometry,  lizardMaterial);
    wall.position.z = (z * cd) + (cd/2)
    wall.position.x = (x * cw)
    wall.rotation.y = 180 * (Math.PI/180)
    
    // wall.applyQuaternion(quaternion);
    scene.add( wall );
  }

  if (west) {
    const wall = new Mesh( wallGeometry,  lizardMaterial);
    wall.position.z = z * cd
    wall.position.x = x * cw - (cw/2)

    wall.rotation.y = 90 * (Math.PI/180)

    // wall.applyQuaternion(quaternion);
    scene.add( wall );
  }

  const floorMaterial = start ? startMaterial : finish ? finishMaterial : concreteMaterial

  const floor = new Mesh( floorGeometry, floorMaterial );
  floor.position.z = z * cd
  floor.position.x = x * cw
  floor.position.y = -(ch/2)
  floor.rotation.x = 270 * (Math.PI/180)
  scene.add( floor );
  const roof = new Mesh( floorGeometry, concreteMaterial );
  roof.position.z = z * cd
  roof.position.x = x * cw
  roof.position.y = +(ch/2)
  roof.rotation.x = 90 * (Math.PI/180)
  scene.add( roof );
}




interface Cell {
  visited: boolean;
  eastWall: boolean;
  southWall: boolean;
  northWall: boolean;
  westWall: boolean;
}

interface Point {
  x: number
  y: number
}

let cells: { [index:number] : { [index:number]: Cell} } = [];
let queue: Point[] = [];
let maxdepth = 0;
let deepest: Point = null;

function init() {
  for (var x = 0; x < w; ++x) {
    cells[x] = [];
    for (var y = 0; y < d; ++y) {
      cells[x][y] = {
        visited: false,
        eastWall: true,
        southWall: true,
        westWall: false,
        northWall: false,
      };
    }
  }
}


function shuffle(array: Point[]) {
  for (var i = array.length - 1; i > 0; --i) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function generate(point: Point, depth: number) {
  if (d > maxdepth) {
    maxdepth = d;
    deepest = point;
  }
  cells[point.x][point.y].visited = true;
  queue.push(point);
  var neighbours = [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 }
  ];
  neighbours = shuffle(neighbours);
  var n;
  for (n of neighbours) {
    if (n.x < 0 || n.x >= w || n.y < 0 || n.y >= d || cells[n.x][n.y].visited)
      continue;
    if (point.x < n.x) cells[point.x][point.y].eastWall = false;
    if (point.x > n.x) cells[n.x][n.y].eastWall = false;
    if (point.y < n.y) cells[point.x][point.y].southWall = false;
    if (point.y > n.y) cells[n.x][n.y].southWall = false;
    generate(n, d + 1);
  }
  queue.push(point);
}

var start = {
  x: Math.floor(Math.random() * w),
  y: Math.floor(Math.random() * d)
};
init()
generate(start, 0);

var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, renderDistance );
camera.zoom = 1
camera.position.x= start.x * cw
camera.position.y= 0
camera.position.z= start.y * cw
camera.updateProjectionMatrix()
const controls = new FirstPersonControls( camera, renderer.domElement );


for (let x = 0; x < w; x++) {
  for (let z = 0; z < d; z++) {
    if (x === 0) {
      cells[x][z].westWall = true
    }
    if (x === w-1) {
      cells[x][z].eastWall = true
    }
    if (z === 0) {
      cells[x][z].northWall = true
    }
    if (z === d - 1) {
      cells[x][z].southWall = true
    }

    if (cells[x-1] && cells[x-1][z].eastWall) {
      cells[x][z].westWall = true
    }
    
    if (cells[x][z-1] && cells[x][z-1].southWall) {
      cells[x][z].northWall = true
    }
  }
}

for (let x = 0; x < w; x++) {
  for (let z = 0; z < d; z++) {
    const c = cells[x][z]
    let finish = false
    if (deepest) {
      finish = x == deepest.x && z == deepest.y
    }
    
    cell(x, z, c.northWall, c.southWall, c.eastWall, c.westWall, x == start.x && z == start.y, )
  }
}



function animate() {
  requestAnimationFrame( animate );

  controls.update(1)
  camera.position.y = 0
  // camera.rotation.y += 0.01
  // camera.updateProjectionMatrix()
	renderer.render( scene, camera );
}
animate();