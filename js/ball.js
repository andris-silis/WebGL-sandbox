;(function (window, THREE) {
	'use strict';

    window.Ball = function (direction, size, color) {
        this.direction = direction;
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(size, 60, 60),
            new THREE.MeshPhongMaterial({ color: color })
        );
//        this.sphere.overdraw = true;
    };

})(window, window.THREE);
