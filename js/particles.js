;(function (window, requestAnimationFrame, _, THREE, Stats, Ball, init) {
//	'use strict';

    // standard global variables
    var container, scene, camera, renderer, controls, stats;
    var keyboard = new THREEx.KeyboardState();
    var clock = new THREE.Clock();
    // custom global variables
    var cube;

    init();
    animate();

    // FUNCTIONS
    function init()
    {
        // SCENE
        scene = new THREE.Scene();
        // CAMERA
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(0,200,400);
        camera.lookAt(scene.position);
        // RENDERER
        if ( Detector.webgl )
            renderer = new THREE.WebGLRenderer( {antialias:true} );
        else
            renderer = new THREE.CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container = document.getElementById( 'ThreeJS' );
        container.appendChild( renderer.domElement );
        // EVENTS
        THREEx.WindowResize(renderer, camera);
        THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
        // CONTROLS
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        // STATS
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );
        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        scene.add(light);
        // FLOOR
//        var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
//        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
//        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( {
//            map: floorTexture,
            color: 0xFF0000,
            side: THREE.DoubleSide
        } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);
        // SKYBOX/FOG
        var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
        scene.add(skyBox);
        scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        ////////////
        // CUSTOM //
        ////////////


        this.particleGeometry = new THREE.Geometry();
        for (var i = 0; i < 2000; i++)
            particleGeometry.vertices.push( new THREE.Vector3(0,0,0) );

//        var discTexture = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        var discTexture = THREE.ImageUtils.loadTexture( 'p_trans6.png' );

        // properties that may vary from particle to particle.
        // these values can only be accessed in vertex shaders!
        //  (pass info to fragment shader via vColor.)
        this.attributes =
        {
            customColor: { type: 'c',  value: [] },
            custompositiona: { type: 'v3', value: [] },
            custompositionb: { type: 'v3', value: [] },
            customOffset: { type: 'f',  value: [] }
        };

        var particleCount = particleGeometry.vertices.length;
        for( var v = 0; v < particleCount; v++ )
        {
            attributes.customColor.value[ v ] = new THREE.Color().setHSL( 1 - v / particleCount, 1.0, 0.5 );
            attributes.customOffset.value[ v ] = 6.282 * (v / particleCount); // not really used in shaders, move elsewhere
        }

        // values that are constant for all particles during a draw call
        this.uniforms =
        {
            amplitude: { type: "f", value: 0.0 },
            color:     { type: "c", value: new THREE.Color( 0xffffff ) },
            direction: { type: "f", value: 1.0 },
            time: { type: "f", value: 1.0 },
            texture: { type: "t", value: discTexture },
        };

        var shaderMaterial = new THREE.ShaderMaterial(
        {
            uniforms: 		uniforms,
            attributes:     attributes,
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader2' ).textContent,
            transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5,
            // blending: THREE.AdditiveBlending, depthTest: false,
            // I guess you don't need to do a depth test if you are alpha blending
            //
        });

        var particleCube = new THREE.ParticleSystem( particleGeometry, shaderMaterial );
        particleCube.position.set(0, 85, 0);
        particleCube.dynamic = true;
        // in order for transparency to work correctly, we need sortParticles = true.
        //  but this won't work if we calculate positions in vertex shader,
        //  so positions need to be calculated in the update function,
        //  and set in the geometry.vertices array
        particleCube.sortParticles = true;
        scene.add( particleCube );

    }

    function animate()
    {
        requestAnimationFrame( animate );
        render();
        update();
    }

    function position(t)
    {
        // x(t) = cos(2t)�(3+cos(3t))
        // y(t) = sin(2t)�(3+cos(3t))
        // z(t) = sin(3t)
//        return new THREE.Vector3(
//            20.0 * Math.cos(2.0 * t) * (3.0 + Math.cos(3.0 * t)),
//            20.0 * Math.sin(2.0 * t) * (3.0 + Math.cos(3.0 * t)),
//            50.0 * Math.sin(3.0 * t)
//        );
        return new THREE.Vector3(
            t * 30.0,
            0.0,
            0.0
        );
    }

    function update()
    {
        if ( keyboard.pressed("z") )
        {
            // do something
        }

        controls.update();
        stats.update();

        var t0 = clock.getElapsedTime();
//        uniforms.time.value = 0.125 * t0;
        uniforms.time.value = 0.5 * t0;

        for( var v = 0; v < particleGeometry.vertices.length; v++ )
        {
            var timeOffset = uniforms.time.value + attributes.customOffset.value[ v ];
            particleGeometry.vertices[v] = position(timeOffset);
        }

    }

    function render()
    {
        renderer.render( scene, camera );
    }


})(window, window.requestAnimationFrame, window._, window.THREE, window.Stats, window.Ball, window.init);
