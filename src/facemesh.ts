import * as facemesh from '@tensorflow-models/facemesh';
require('@tensorflow/tfjs-backend-webgl');
let model: facemesh.FaceMesh | undefined;
export async function loadFacemesh() {
    model = await facemesh.load();
}
export async function estimateFace(input: HTMLVideoElement) {
    console.log(await model?.estimateFaces(input));
}