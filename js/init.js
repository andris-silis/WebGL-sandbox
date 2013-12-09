;(function (window, THREE, Stats) {
	'use strict';

    var initLightning = function () {
        // // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = -280;
        pointLight.position.y = -150;
        pointLight.position.z = 10000;
        pointLight.intensity = 1.2;
        pointLight.distance = 100000;

        // add to the scene
        window.scene.add(pointLight);
    };

    var initScene = function () {
        var scene = new THREE.Scene();

        window.scene = scene;
    };

    var initCamera = function () {
        var camera = new THREE.PerspectiveCamera(
            75, document.body.clientWidth / document.body.clientHeight, 0.1, 1000
        );
        camera.position.z = 100;

        window.camera = camera;
    };

    var initRenderer = function () {
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(document.body.clientWidth, document.body.clientHeight);

        document.body.appendChild(renderer.domElement);

        renderer.setClearColor(0x000000, 1.0);
//        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.clear();

        window.renderer = renderer;
    };

    var initStats = function () {
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        window.stats = stats;
    };

    window.init = function () {
        initScene();
        initCamera();
        initRenderer();
        initLightning();

        initStats();
    };

})(window, window.THREE, window.Stats);
