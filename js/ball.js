;(function (window, THREE) {
	'use strict';

    window.Ball = function (dirX, dirY, size, color) {
        this.dirX = dirX;
        this.dirY = dirY;
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(size, 60, 60),
            new THREE.MeshPhongMaterial({ color: color })
        );
//        this.sphere.overdraw = true;
    };

})(window, window.THREE);
