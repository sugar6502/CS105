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
    camera.position.set(100,100,150);


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
    sphere.name = 'planet';

    scene.add( sphere );

    const sun_geometry = new THREE.SphereGeometry( 5, 64, 32 ); 

    const sun_texture = new THREE.TextureLoader().load('./textures/sun.jpg' ); 
    const sun_material = new THREE.MeshBasicMaterial({
        transparent: true,
        roughness: 0.07,
        side: THREE.DoubleSide,
        shininess: 60,
        map: sun_texture
    }); 

    const sun = new THREE.Mesh( sun_geometry, sun_material ); 
    sun.scale.set(7,7,7);
    sun.castShadow = true;



    GUI
    const params = {
        Texture: {
            map: null,
            map_bump: null,
            displacementMap: null,
            specularmap: null,
            alphamap:null,
            emissivemap:null
        },

        PointLight: {
            visible: false,
            color: 0xffffff,
            intensity: 1
        }
       
    };
    



    const gui = new GUI({
        width: 150,
        
    });
 
    
    {
        const PointLight = gui.addFolder('Point Light - Sun');
        var light_po = new THREE.PointLight({color: 0xffffff, intensity: 1});
        light_po.position.set( 75, 55, -100 );
        light_po.castShadow = true;
        

        PointLight.add(params.PointLight,"visible").onChange(value => {
        if(value == true) {
            PointLight.open();
            scene.add(light_po);
            light_po.add(sun);
        }
        else { 
            PointLight.close();
            scene.remove(light_po);
        }
        });
    
        PointLight.addColor(params.PointLight,'color').onChange(value => {
            light_po.color.set(value);
        });
    
        PointLight.add(params.PointLight,'intensity',0,100).onChange(value => {
            light_po.intensity = value;
      
        });
        PointLight.add(light_po.position, 'x', -100, 100);
        PointLight.add(light_po.position, 'y', -100, 100);
        PointLight.add(light_po.position, 'z', -100, 100);
    }
    {
        const Texture = gui.addFolder('Texture - Planet');
        Texture.add( params, 'map', textures ).onChange( function ( val ) {

            material.map = val;
            material.needsUpdate = true;

        } );

        Texture.add( params, 'map_bump', textures ).onChange( function ( val ) {

            material.bumpMap = val;
            material.needsUpdate = true;
            

        } );
    
        Texture.add( params, 'displacementMap',textures).onChange( function ( val ) {

        
            material.displacementMap = val;
            material.needsUpdate = true;
            

        } );
        Texture.add( params, 'specularmap',textures).onChange( function ( val ) {

            
            material.specularMap = val;

            material.needsUpdate = true;
            

        } );
        Texture.add( params, 'alphamap',textures).onChange( function ( val ) {
    
            
            material.alphaMap = val;
            material.needsUpdate = true;
            

        } );
        Texture.add( params, 'emissivemap',textures).onChange( function ( val ) {
            
            material.emissiveMap = val;
            
            material.needsUpdate = true;
        
        } );
    }

    
    

///-----------------------------------------------------------
    renderer.render( scene, camera );
    animate();

}

function animate() {
    requestAnimationFrame(animate)

    var sphere = scene.getObjectByName('planet');
    sphere.rotation.x += 0.01;
    render();

    //stats.update()
}

function render() {
    renderer.render(scene, camera)
}
