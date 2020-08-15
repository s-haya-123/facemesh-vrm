import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import {  } from 'three/examples/jsm/'
import { VRMUtils, VRM, VRMSchema } from '@pixiv/three-vrm';
// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// camera
const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
camera.position.set( 0.0, 1.0, 5.0 );

// camera controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = true;
controls.target.set( 0.0, 1.0, 0.0 );
controls.update();

// scene
const scene = new THREE.Scene();

// light
const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add( light );

// gltf and vrm
const loader = new GLTFLoader();
loader.crossOrigin = 'anonymous';
loader.load(

    // URL of the VRM you want to load
    '/static/AliciaSolid.vrm',

    // called when the resource is loaded
    ( gltf ) => {

        // calling this function greatly improves the performance
        VRMUtils.removeUnnecessaryJoints( gltf.scene );

        // generate VRM instance from gltf
        VRM.from( gltf ).then( ( vrm ) => {

            console.log( vrm );
            scene.add( vrm.scene );

            // vrm?.humanoid?.getBoneNode( VRMSchema.HumanoidBoneName.Hips )?.rotation.y = Math.PI;

        } );

    },

    // called while loading is progressing
    ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

    // called when loading has errors
    ( error ) => console.error( error )

);
let mesh1;
// the inside of the hole
let geometry1	= new THREE.BoxGeometry(2,2,2);
let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load( 'static/tiles.jpg' );
let material1	= new THREE.MeshLambertMaterial({
    transparent : true,
    map: texture,
    side: THREE.BackSide
}); 

mesh1 = new THREE.Mesh( geometry1, material1 );
mesh1.position.y = 1;

// geometry1.faces.splice(4, 2); // make hole by removing top two triangles
// markerRoot1.add( mesh1 );
scene.add( mesh1 );

// the invisibility cloak (box with a hole)
let geometry0 = new THREE.BoxGeometry(2,2,2);
geometry0.faces.splice(4, 2); // make hole by removing top two triangles

let material0 = new THREE.MeshBasicMaterial({
    colorWrite: false
});

let mesh0 = new THREE.Mesh( geometry0, material0 );
mesh0.scale.set(1,1,1).multiplyScalar(1.01);
mesh0.position.y = 1;
scene.add( mesh0 );
// markerRoot1.add(mesh0);	

// helpers
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

}

animate();