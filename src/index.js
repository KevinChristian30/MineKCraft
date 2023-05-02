/**
 * Please Read ReadMe.txt
 */

import * as THREE from '../three.js/build/three.module.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();

const defaultCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
defaultCamera.lookAt(0, 0, 0);
defaultCamera.position.set(0, 8, 8);

const stevePOVCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
stevePOVCamera.lookAt(0, 0, 0);
stevePOVCamera.position.set(-2, 2.5, -0.5);
stevePOVCamera.rotateY(Math.PI)

let currentCamera = defaultCamera;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls(currentCamera, renderer.domElement);
controls.enablePan = true;
controls.update();

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, currentCamera );
};
animate();

function resizeWindow() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  currentCamera.aspect = window.innerWidth / window.innerHeight;
  currentCamera.updateProjectionMatrix();
}
window.onresize = resizeWindow;

function switchToStevePOV() {
  currentCamera = stevePOVCamera;
  console.log(currentCamera);
}

function switchToDefaultCamera() {
  window.addEventListener('keydown', (event) => {
    if (event.code == 'Space') currentCamera = defaultCamera;
  });
}
switchToDefaultCamera();

function addSkybox() {

  let textureLoader = new THREE.TextureLoader()

  let boxMaterialArr = [
    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_right.jpg'),
      side : THREE.DoubleSide
    }),

    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_left.jpg'),
      side : THREE.DoubleSide
    }),

    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_top.jpg'),
      side : THREE.DoubleSide
    }),

    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_bottom.jpg'),
      side : THREE.DoubleSide
    }),

    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_front.jpg'),
      side : THREE.DoubleSide
    }),

    new THREE.MeshBasicMaterial({
      map : textureLoader.load('./assets/skybox/daylight_box_back.jpg'),
      side : THREE.DoubleSide
    }),
  ]

  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
  let skybox = new THREE.Mesh(skyboxGeo, boxMaterialArr)
  scene.add(skybox)

}
addSkybox();

function addAmbientLight() {
  let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
  scene.add(ambientLight)
}
addAmbientLight();

let floor;
function addFloor() {
  const geometry = new THREE.PlaneGeometry( 100, 100 );
  let image = new THREE.TextureLoader().load('./assets/texture-grass-field.jpg');
  image.wrapS = THREE.RepeatWrapping;
  image.wrapT = THREE.RepeatWrapping;
  image.repeat.set(50, 50);

  let texture = new THREE.TextureLoader().load('./assets/nmap.jpeg');

  let material = new THREE.MeshStandardMaterial({
    roughness : 1,
    map : image,
    normalMap : texture,
    side: THREE.DoubleSide
  });

  const plane = new THREE.Mesh( geometry, material );
  plane.receiveShadow = true;
  plane.rotateX(Math.PI / 2);
  scene.add( plane );

  floor = plane;
}
addFloor();

function addDirectionalLight() {
  let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
  directionalLight.position.set(3, 5, 10);
  directionalLight.target = floor;
  directionalLight.castShadow = true;
  let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

  scene.add(directionalLight);
  scene.add(directionalLightHelper);
}
addDirectionalLight();

function addCoalBlock() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let image = new THREE.TextureLoader().load('./assets/texture-coal.jpg');

  let texture = new THREE.TextureLoader().load('./assets/nmap.jpeg');

  let material = new THREE.MeshStandardMaterial({
    roughness : 1,
    map : image,
    normalMap : texture,
    side: THREE.DoubleSide
  });

  const box = new THREE.Mesh( geometry, material );
  box.position.set(0, 0.5, 10);
  box.castShadow = true;
  scene.add( box );
}
addCoalBlock();

function addPartyHat() {
  let geometry = new THREE.ConeGeometry(0.4, 1, 64, 1, true)
  let material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side : THREE.DoubleSide
  });
  let cone = new THREE.Mesh(geometry, material);
  cone.castShadow = true;
  cone.position.set(-2, 4.5, -1);

  scene.add(cone);
}
addPartyHat();

function addBall() {
  let sphereGeo = new THREE.SphereGeometry(0.5, 64, 64);
  let sphereMaterial = new THREE.MeshNormalMaterial();
  let sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
  sphere.position.set(-2, 0.5, 5);
  sphere.castShadow = true;

  scene.add(sphere);
}
addBall();

function addPillar() {
  let geometry = new THREE.CylinderGeometry(1, 2, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 'gray'
  });
  let cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(-2, 0.5, -1);

  scene.add(cylinder);
}
addPillar();

function addSteve(object) {
  let model = object.scene;
  model.scale.set(0.1, 0.1, 0.1);
  model.position.set(-2, 2.5, -1);
  model.name = 'steve';
  model.castShadow = true;

  scene.add(model);
}
new GLTFLoader().load('./assets/steve_minecraft/scene.gltf', (object) => addSteve(object));

function addRaycast() {
  var raycast = new THREE.Raycaster();
  var pointer = new THREE.Vector2();

  window.addEventListener("pointerdown", (e) => {
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycast.setFromCamera(pointer, currentCamera);

    let intersects = raycast.intersectObjects(scene.children);

    intersects.forEach((object) => {
      if (object.object.name === 'Steve_02_-_Default_0') switchToStevePOV();
    });
  });
}
addRaycast();
