import { Camera, Quaternion, Vector3, Math as _Math } from "three";


export default class Controller {
  protected camera: Camera;
  protected canvas: HTMLCanvasElement;

  protected mouseDelta = {x: 0, y: 0};
  protected targetPosition = new Vector3();

  protected lat = 0;
	protected lon = 0;
  
  protected verticalMin = 0;
  protected verticalMax = Math.PI;
  
  protected pointerLocked = false;

  protected moveForward = false;
  protected moveLeft = false;
  protected moveBackward = false;
  protected moveRight = false;
  protected sprint = false;

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;

    this.init()
  }

  init() {
    this.canvas.requestPointerLock()

    this.canvas.addEventListener('mousemove', (event) => this._mouseMove(event))
    this.canvas.addEventListener('click', (event) => this._click(event))
    document.addEventListener('keydown', (event) => this._onKeyDown(event))
    document.addEventListener('keyup', (event) => this._onKeyUp(event))
    document.addEventListener('pointerlockchange', this._pointerLock)
  }

  _mouseMove(event: MouseEvent) {
    this.mouseDelta.x += event.movementX
    this.mouseDelta.y += event.movementY
  }
  _click(event: MouseEvent) {
    if (!this.pointerLocked) {
      this.canvas.requestPointerLock()
    }
  }

  _onKeyDown(event: KeyboardEvent) {
		switch ( event.keyCode ) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
      case 68: /*D*/ this.moveRight = true; break;
      
      case 16: /*shift*/ this.sprint = true; break;
		}
	};

	_onKeyUp(event: KeyboardEvent) {
		switch ( event.keyCode ) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
      case 68: /*D*/ this.moveRight = false; break;
      
      case 16: /*shift*/ this.sprint = false; break;
    }
	};

  private _pointerLock(event: Event) {
    this.pointerLocked = document.pointerLockElement === this.canvas
  }


  _updateCameraPosition(delta: number) {
    var actualMoveSpeed = delta * 4;

    if (this.moveForward) {
      let sprintSpeed = 0;
      if (this.sprint) {
        sprintSpeed  = 2;
      } 
      this.camera.translateZ(-actualMoveSpeed - sprintSpeed);
    } else if (this.moveBackward) {
      this.camera.translateZ(actualMoveSpeed);
    }

    if (this.moveLeft) {
      this.camera.translateX(-actualMoveSpeed);
    } else if (this.moveRight) {
      this.camera.translateX(actualMoveSpeed);
    }
  } 
  _updateCameraDirection(delta: number) {
    const actualLookSpeed = 1

    var verticalLookRatio = 1;
    this.lon -= this.mouseDelta.x * actualLookSpeed;
    this.lat -= this.mouseDelta.y * actualLookSpeed * verticalLookRatio;

    this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

    var phi = _Math.degToRad( 90 - this.lat );
    var theta = _Math.degToRad( this.lon );
    
    phi = _Math.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
    
    var position = this.camera.position;

    this.targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

    this.camera.lookAt( this.targetPosition );
  
    this.mouseDelta.x = 0
    this.mouseDelta.y = 0
  }
  update(delta: number = 1) {
    this._updateCameraPosition(delta)
    this._updateCameraDirection(delta)
  }
}
