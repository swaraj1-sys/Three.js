import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);
const fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
camera.position.z = 5;
new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xff0000, 0.1);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Create a line geometry from spline.js
// const points = spline.getPoints(100);
// const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const material = new THREE.LineBasicMaterial({color:0xff0000 });
//const line = new THREE.Line(geometry, material);
//scene.add(line);


//glow effect 
// const composer= new THREE.EffectComposer(renderer);
// const renderPass = new THREE.RenderPass(scene, camera);
// composer.addPass(renderPass);
// const bloomPass = new THREE.UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     1.5,
//     0.4,
//     0.85
// );
// composer.addPass(bloomPass);
//create a tube geometry
const tubegeo = new THREE.TubeGeometry(spline,222,0.65,16,true);
const tubemat = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    wireframe:true,
});
const tube = new THREE.Mesh(tubegeo,tubemat);
scene.add(tube);

//create edges geometry
const edges = new THREE.EdgesGeometry(tubegeo,0.);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff});
const tubeLines = new THREE.LineSegments(edges,lineMat);
scene.add(tubeLines);

//const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444);
//scene.add(hemiLight);


//add cubes
const numBoxes  = 100;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size,size,size);
for (let i = 0; i < numBoxes; i+=1){
    const boxMat = new THREE.MeshBasicMaterial({
        color:0xffffff,
        wireframe:true,
    });
    const box = new THREE.Mesh(boxGeo,boxMat);
    const p = (i / numBoxes + Math.random()*0.1) % 1;
    const pos = tubegeo.parameters.path.getPointAt(p);
    pos.x += Math.random()- 0.4;
    pos.z += Math.random() - 0.4;
    const rote = new THREE.Vector3(
        Math.random()* Math.PI,
        Math.random()* Math.PI,
        Math.random()* Math.PI,

    );
    box.rotation.set(rote.x,rote.y,rote.z);
    const edges = new THREE.EdgesGeometry(boxGeo, 0.3);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffff00});
    const boxLines = new THREE.LineSegments(edges,lineMat);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x,rote.y,rote.z);
    scene.add(boxLines);

}

//add a sphere 
const numSpheres = 50;
const sphereSize = 0.05;
const sphereGeo = new THREE.SphereGeometry(sphereSize, 16, 16);
for (let i = 0; i < numSpheres; i += 1) {
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    const p = (i / numSpheres + Math.random() * 0.1) % 1;
    const pos = tubegeo.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.4;
    const rote = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    sphere.rotation.set(rote.x, rote.y, rote.z);
    const edges = new THREE.EdgesGeometry(sphereGeo, 0.3);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const sphereLines = new THREE.LineSegments(edges, lineMat);
    sphereLines.position.copy(pos);
    sphereLines.rotation.set(rote.x, rote.y, rote.z);
    scene.add(sphereLines);
}

//add a flythru
function updateCamera(t){
    const time = t*0.2;
    const looptime = 8 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubegeo.parameters.path.getPointAt(p);
    const lookAt = tubegeo.parameters.path.getPointAt((p + 0.01) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
    
}
function animate(t=0){
   requestAnimationFrame(animate);
   updateCamera(t);
   renderer.render(scene,camera);
   controls.update();
}
animate();
