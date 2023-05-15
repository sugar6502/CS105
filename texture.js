import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'
import {GUI} from 'GUI'
import {GLTFLoader} from 'GLTFLoader'

let renderer, scene, camera;






init();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,3,24);


    const controls = new OrbitControls( camera, renderer.domElement );

  

    //textures----------------------------------------------
    //diffuse: set main color cho surface
    //bump: tạo vết lòi lõm

    const loader = new THREE.TextureLoader().setPath( './textures/' );
    const filenames = [ 'mars_bump.jpg','red.jpg','earth.jpg','reflectance.jpg','earthbump.jpg','nightmap.jpg'];
    const textures = { none: null };

    for ( let i = 0; i < filenames.length; i ++ ) {

        const filename = filenames[ i ];

        const texture = loader.load( filename );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        textures[ filename ] = texture;

    }
    
    scene.background = new THREE.TextureLoader().load('./textures/stars.jpg')
    
///-----------------------------------------------------------
//Sphere
//MeshPhongMaterial
//MeshToonMaterial: Mở rộng của Phong

    const geometry = new THREE.SphereGeometry( 1, 64, 32 ); 

    const material = new THREE.MeshPhongMaterial({
        transparent: true,
        roughness: 0.07,
        side: THREE.DoubleSide,
        shininess: 60,
     
        //-> demo emissive mới dùng
        // emissive: "white",
        // emissiveIntensity: 0.1, 
     
        

    
    }); 



    const sphere = new THREE.Mesh( geometry, material ); 
    sphere.scale.set(5,5,5);
    sphere.castShadow = true;


    scene.add( sphere );

    
    const light = new THREE.DirectionalLight( 0xffffff, 10 );
    light.position.z = 0.5;
    light.position.y = 0;// 1
    
    //const light = new THREE.AmbientLight(0xffffff);


    scene.add( light );



    GUI
    const params = {
        map: null,
        map_bump: null,
        displacementMap: null,
        specularmap: null,
        alphamap:null,
        emissivemap:null,

       
    
    };
    



    const gui = new GUI({
        width: 150,
        
    });
 
    
   
    
    gui.add( params, 'map', textures ).onChange( function ( val ) {

        material.map = val;
        material.needsUpdate = true;

    } );

    gui.add( params, 'map_bump', textures ).onChange( function ( val ) {

        material.bumpMap = val;
        material.needsUpdate = true;
        

    } );
   
    gui.add( params, 'displacementMap',textures).onChange( function ( val ) {

       
        material.displacementMap = val;
        material.needsUpdate = true;
        

    } );
    gui.add( params, 'specularmap',textures).onChange( function ( val ) {

         
        material.specularMap = val;

        material.needsUpdate = true;
        

    } );
    gui.add( params, 'alphamap',textures).onChange( function ( val ) {
   
         
        material.alphaMap = val;
        material.needsUpdate = true;
        

    } );
    gui.add( params, 'emissivemap',textures).onChange( function ( val ) {
        
        
        
        material.emissiveMap = val;
        
        material.needsUpdate = true;
        

    } );

    
    

///-----------------------------------------------------------
    renderer.render( scene, camera );
    animate();

}

function animate() {
    requestAnimationFrame(animate)
    // updateFcts.push(function(delta, now) {
    //     sphere.rotation.y += 1 / 16 * delta;
    //   })
    // controls.update()
    // mainLight.update();
    render();

    //stats.update()
}

function render() {
    renderer.render(scene, camera)
}
