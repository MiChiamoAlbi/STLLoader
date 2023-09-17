//https://threejs.org/editor/
import * as THREE from 'three';
import * as STLLoader from 'stl-loader';
import * as OrbitControls from 'orbit-controls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//X  red. Y  green. Z  blue.
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
let lightGroup = new THREE.Group();

function fitScreen(mesh){
    scene.remove(light);

    mesh.geometry.computeBoundingBox();
    let boundingBox = mesh.geometry.boundingBox;
    
    let diagonal = new THREE.Vector3().subVectors(boundingBox.max, boundingBox.min);
    let distance = diagonal.length() / (2 * Math.tan( camera.fov * Math.PI / 360 ));

    let center = new THREE.Vector3().addVectors(boundingBox.max, boundingBox.min).multiplyScalar(0.5);
    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);

    light.position.set(0,distance,distance);
    scene.add(light);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();    
}

//responsive
window.addEventListener('resize', function(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})

scene.background = new THREE.Color('#f9dc5c');

const group = new THREE.Group();
scene.add(group);

function loadSTL(file) {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
        const contents = event.target.result;

        const loader = new STLLoader.STLLoader();
        const geometry = loader.parse(contents);

        const material = new THREE.MeshStandardMaterial({color: 0xcfcfcf, roughness: 0.5});
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        
        light.position.set(0,10,-10);
        scene.add(light);

        group.add(mesh);
        fitScreen(mesh);
    });

    reader.readAsArrayBuffer(file);
}

try{
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            group.clear();
            loadSTL(file);
        }
    });
} catch {
    ;  //pass if the input doesn't exist
}

const loadObject = () => {
    const loader = new STLLoader.STLLoader();
    loader.load(mesh_example, function (geometry) {
        const material = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 0.5 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.center();
        group.add(mesh);

        fitScreen(mesh);
    },
    (error) => {
        console.log(error)
    });
};

let controls = new OrbitControls.OrbitControls(camera,renderer.domElement);
controls.update();

loadObject();

let flag = true;
try{
    const switchCheckbox = document.getElementById("flexSwitchCheckDefault");
    switchCheckbox.addEventListener("change", function() {
        if (this.checked) {
        flag = true;
        } else {
        flag = false;
        }
    });
} catch {
    ;  //pass if the input doesn't exist
}

function animate() {
    requestAnimationFrame( animate );

    if(flag){
        group.rotation.x += 0.01;
        group.rotation.y += 0.01;
    }

    renderer.render( scene, camera );
    controls.update();
};

animate();