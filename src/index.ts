import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import {  } from 'three/examples/jsm/'
import { VRMUtils, VRM, VRMSchema } from '@pixiv/three-vrm';
import { loadFacemesh, estimateFace } from './facemesh';
// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
// renderer.setPixelRatio( window.devicePixelRatio );
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
        } );

    },

    // called while loading is progressing
    ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

    // called when loading has errors
    ( error ) => console.error( error )

);
// helpers
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
let loaded = false
function animate() {
    requestAnimationFrame( animate );
    const video = loaded && document.getElementById('debug') as HTMLVideoElement | undefined;
    renderer.render( scene, camera );
}
async function startVideo() {
    const video = document.getElementById('debug') as HTMLVideoElement | undefined;
    await loadFacemesh();
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: window.innerWidth/2, 
            height: window.innerHeight/2
        },
        audio: false
    });
    if(video) {
        video.srcObject = stream;
        video.onloadedmetadata = (evt) => {
            video.play();
            loaded = true;
            setTimeout(() => video && estimateFace(video), 100);
            renderDegugCanvas();
        };
    }
}
function renderDegugCanvas() {
    const video = document.getElementById("debug") as HTMLVideoElement;
    const canvas = document.getElementById("debug-canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight/2;
    const ctx = canvas.getContext('2d');
    setInterval(() => {
        if (canvas && ctx){
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
    }, 10000/120);
}

animate();
startVideo();