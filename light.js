import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'
import {GUI} from 'GUI'
import {GLTFLoader} from 'GLTFLoader'
import {VertexNormalsHelper} from 'VertexNormalsHelper'
import {RectAreaLightUniformsLib} from 'RectAreaLightUniformsLib'
import {RectAreaLightHelper} from 'RectAreaLightHelper'


let renderer, scene, camera;
let Light, lightHelper,light_re
const model = new GLTFLoader();
model.load(
    './model/polybios.glb',
    function(gltf) {
        //gltf.scene.rotation.set(0,90,0);
        gltf.scene.scale.set(2,2,2);
        gltf.scene.position.set(0,0,10);
        gltf.scene.rotation.y +=90;
        

        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
             
             
            }
        })
        scene.add(gltf.scene)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)



init();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;

    renderer.setAnimationLoop( render );

    scene = new THREE.Scene();
 
   
   
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,50,30);


    //------------Textures
    const loader = new THREE.TextureLoader().setPath('textures/' );
    const filenames = [ 'disturb.jpg'];
    const textures = { none: null };

    for ( let i = 0; i < filenames.length; i ++ ) {

        const filename = filenames[ i ];

        const texture = loader.load( filename );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        textures[ filename ] = texture;

    }

  




//-----------------------
  

        //---------Plane


    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    const material = new THREE.MeshLambertMaterial( { color: 0x808080 } );
    
    

    
    const mesh = new THREE.Mesh( geometry, material );
 
    mesh.rotation.x = - Math.PI / 2;

    mesh.receiveShadow = true;

    const helpe = new VertexNormalsHelper( mesh, 1000, 0xff0000 );
    scene.add( helpe );
    

    scene.add( mesh );
    //----------------------------------------------
    const cube = new THREE.BoxGeometry( 10, 10 ,10);
    const material_cube = new THREE.MeshLambertMaterial();
    const mesh_cube = new THREE.Mesh( cube, material_cube );
    mesh_cube.position.set(15,5,-50);

    mesh_cube.receiveShadow = true;
    mesh_cube.castShadow = true;
    

    scene.add( mesh_cube );


    const controls = new OrbitControls( camera, renderer.domElement );

    //----------------------------------------
    //---------Model





   
//------------------------------------------------------    

//----------------------GUI
const gui = new GUI({
    width: 150,
    
});

const params = {
    AmbientLight: {
        visible: false,
        color: 0xffffff,
        intensity: 1,
    },

    DirectionalLight: {
        visible: false,
        color: 0xffffff,
        intensity: 1,
     

    },
    HemisphereLight: {
        visible: false,
        skyColor: 0xf0e424,
        groundColor:  0xd41384,
        intensity: 1,
     

    },
    PointLight: {
        visible: false,
        color: 0xffffff,
        intensity: 1,
        decay: 2,
        distance: 0.0,
        power: 1.0
    },


    SpotLight: {
        visible: false,
        color: 0xffffff,
        intensity: 1,
        angle: Math.PI / 3,
        distance: 0,
        focus:1,
        decay:2,
        penumbra: 0,
        power: 1.0,
        texture: null
    },
    RectAreaLight: {
        visible: false,
        color: 0xffffff,
        intensity: 5,
        height: 10,
        width: 4,
      

    }
};

{
    const AmbientLight = gui.addFolder('AmbientLight');
    var light = new THREE.AmbientLight({color: 0xffffff, intensity: 1,});
    AmbientLight.add(params.AmbientLight,"visible").onChange(value => {
    if(value == true) {
        AmbientLight.open();
        scene.add(light);

    }
    else { 
        AmbientLight.close();
        scene.remove(light);
    }
    });

    AmbientLight.addColor(params.AmbientLight,'color').onChange(value => {
        light.color.set(value);
        
    });

    AmbientLight.add(params.AmbientLight,'intensity',0,10).onChange(value => {
        light.intensity =value;
    });
};

{
    const DirectionalLight = gui.addFolder('DirectionalLight');
    var light_di = new THREE.DirectionalLight({color: 0xffffff, intensity: 1});
    light_di.position.set( 25, 50, 0 );
    light_di.castShadow = true;
    

    var helper_di = new THREE.DirectionalLightHelper(light_di); 
    Light = light_di;
    lightHelper = helper_di;
    DirectionalLight.add(params.DirectionalLight,"visible").onChange(value => {
    if(value == true) {
        DirectionalLight.open();
        scene.add(light_di);
        scene.add( helper_di );


    }
    else { 
        DirectionalLight.close();
        scene.remove(light_di);
        scene.remove(helper_di)
    }
    });

    DirectionalLight.addColor(params.DirectionalLight,'color').onChange(value => {
        light_di.color.set(value);
        helper_di.update();
        
    });

    DirectionalLight.add(params.DirectionalLight,'intensity',0,10).onChange(value => {
        light_di.intensity =value;
      
    });



}

{
    const HemisphereLight = gui.addFolder('HemisphereLight');
    const skyColor = 0xf0e424;
    const groundColor = 0xd41384;
    var light_he = new THREE.HemisphereLight(skyColor,groundColor,1);
    light_he.position.set( 0, 50, 0 );
    
    var helper_he = new THREE.HemisphereLightHelper(light_he, 3); 

 
    HemisphereLight.add(params.HemisphereLight,"visible").onChange(value => {
    if(value == true) {
        HemisphereLight.open();
        scene.add(light_he);
        scene.add( helper_he );


    }
    else { 
        HemisphereLight.close();
        scene.remove(light_he);
        scene.remove(helper_he)
    }
    });

    HemisphereLight.addColor(params.HemisphereLight,'skyColor').onChange(value => {
        light_he.color.set(value);
        helper_he.update();
        
    });
    HemisphereLight.addColor(params.HemisphereLight,'groundColor').onChange(value => {
        light_he.groundColor.set(value);
        helper_he.update();
        
    });

    HemisphereLight.add(params.HemisphereLight,'intensity',0,10).onChange(value => {
        light_he.intensity =value;
       
    });





}
{

    const PointLight = gui.addFolder('PointLight');
    var light_po = new THREE.PointLight({color: 0xffffff, intensity: 1});
    light_po.position.set( 25, 50, 0 );
    light_po.castShadow = true;
    

    var helper_po = new THREE.PointLightHelper(light_po,3); 
    Light = light_po;
    lightHelper = helper_po;
    PointLight.add(params.PointLight,"visible").onChange(value => {
    if(value == true) {
        Light = light_po;
        PointLight.open();
        scene.add(light_po);
        scene.add( helper_po );


    }
    else { 
        PointLight.close();
        scene.remove(light_po);
        scene.remove(helper_po)
    }
    });

    PointLight.addColor(params.PointLight,'color').onChange(value => {
        light_po.color.set(value);
        helper_po.update();
        
    });

    PointLight.add(params.PointLight,'intensity',0,10).onChange(value => {
        light_po.intensity =value;
  
    });
    PointLight.add(params.PointLight,'decay',0,5).onChange(value => {
        light_po.decay=value;
        helper_po.update();
    });
    PointLight.add(params.PointLight,'distance',0,1000).onChange(value => {
        light_po.distance=value;
        helper_po.update();
    });
    PointLight.add(params.PointLight,'power',0,10).onChange(value => {
        light_po.power=value;
        helper_po.update();
    });
    

}

{

    const SpotLight = gui.addFolder('SpotLight');
    var light_sp = new THREE.SpotLight({color: 0xffffff, intensity: 1});
    light_sp.position.set( 25, 50, 0 );
    light_sp.castShadow = true;
    

    var helper_sp = new THREE.SpotLightHelper(light_sp, 0xffffff ); 
    Light = light_sp;
    lightHelper = helper_sp;
    SpotLight.add(params.SpotLight,"visible").onChange(value => {
    if(value == true) {
        SpotLight.open();
        Light = light_sp;
        scene.add(light_sp);
        scene.add( helper_sp );


    }
    else { 
        SpotLight.close();
        scene.remove(light_sp);
        scene.remove(helper_sp);

    }
    });

    SpotLight.addColor(params.SpotLight,'color').onChange(value => {
        light_sp.color.set(value);
        helper_sp.update();
        
    });

    SpotLight.add(params.SpotLight,'intensity',0,10).onChange(value => {
        light_sp.intensity =value;
       
    });
    SpotLight.add(params.SpotLight,'angle',0,Math.PI).onChange(value => {
        light_sp.angle=value;
        helper_sp.update();
    });
    SpotLight.add(params.SpotLight,'distance',0,1000).onChange(value => {
        light_sp.distance=value;
        helper_sp.update();
    });
    SpotLight.add(params.SpotLight,'focus',0,1).onChange(value => {
        light_sp.shadow.focus=value;
        helper_sp.update();
    });
    SpotLight.add(params.SpotLight,'decay',0,5).onChange(value => {
        light_sp.decay=value;
        helper_sp.update();
    });
    SpotLight.add(params.SpotLight,'penumbra',0,1).onChange(value => {
        light_sp.penumbra=value;
        helper_sp.update();
    });
    SpotLight.add(params.SpotLight,'power',0,10).onChange(value => {
        light_sp.power=value;
    
    });
    SpotLight.add(params.SpotLight,'texture',textures).onChange(value => {
        light_sp.map=value;
     
    });
    


}

{
    const RectAreaLight = gui.addFolder('RectAreaLight');
   
  
   
    

    light_re = new THREE.RectAreaLight(0xffffff, 5, 4, 10 );
    light_re.lookAt(0, 0, 0);
    light_re.position.set( 10, 0, 20 );
    
    var helper = new RectAreaLightHelper(light_re); 
   
   
    
    RectAreaLight.add(params.RectAreaLight,"visible").onChange(value => {
    if(value == true) {
        RectAreaLight.open();
    
        Light = light_po;
        scene.add(light_re);
        scene.add( helper );
         
    }
    else { 
        RectAreaLight.close();
        scene.remove(light_re);
        scene.remove(helper);

       

    }

    });
    RectAreaLight.addColor(params.RectAreaLight,'color').onChange(value => {
        light_re.color.set(value);
  
        
    });

    RectAreaLight.add(params.RectAreaLight,'intensity',0,10).onChange(value => {
        light_re.intensity =value;

    });
    RectAreaLight.add(params.RectAreaLight,'height',0,1000).onChange(value => {
        light_re.height=value;
 
    });
    RectAreaLight.add(params.RectAreaLight,'width',0,1000).onChange(value => {
        light_re.width=value;
    
    });


    



}


}

function render() {

    const time = performance.now() / 3000;

    Light.position.x = Math.cos( time ) * 25;
    Light.position.z = Math.sin( time ) * 25;
    light_re.rotation.x += 0.005

    lightHelper.update();

    renderer.render( scene, camera );

}

function animate() {
    
    requestAnimationFrame(animate);
   

    //controls.update();

    render();

    //stats.update()
};