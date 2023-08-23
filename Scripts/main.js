//https://threejs.org/editor/
import * as THREE from 'three';
import * as STLLoader from 'stl-loader';
import * as OrbitControls from 'orbit-controls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//const axesHelper = new THREE.AxesHelper( 5 );
//scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//responsive
window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})

scene.background = new THREE.Color('#f9dc5c');

const group = new THREE.Group();
scene.add(group);

const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
light.position.set(0,1,-1);
scene.add(light);

const loadObject = () => {
    const loader = new STLLoader.STLLoader()
    loader.load("example.stl", function (geometry) {
        const material = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 0.5 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.center();
        group.add(mesh);
    },
    (error) => {
        console.log(error)
    }
    )
}
                        
const cube = () => {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
    const cube = new THREE.Mesh( geometry, material )
    group.add( cube )
}
const cube2 = () => {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial( { color: 0xf9dc5c } )
    const cube = new THREE.Mesh( geometry, material )
    group.add( cube )
}

var controls = new OrbitControls.OrbitControls(camera,renderer.domElement);
controls.update();


loadObject();
//cube();
//cube2();
camera.position.x = 30;
camera.position.z = -10;
camera.rotation.y = 90;

function animate() {
    requestAnimationFrame( animate );

    group.rotation.x += 0.01;
    group.rotation.y += 0.01;

    renderer.render( scene, camera );
    controls.update();
};

animate();