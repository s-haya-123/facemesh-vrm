import facemesh from '@tensorflow-models/facemesh';

export async function loadFacemesh() {
    const model = await facemesh.load();
}