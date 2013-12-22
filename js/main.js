;(function (window, requestAnimationFrame, _, THREE, Stats, Ball, init) {
	'use strict';

    var BALL_SPEED = 0.02;

    init();

    var scene = window.scene;
    var camera = window.camera;
    var renderer = window.renderer;
    var stats = window.stats;

    var getRandomBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    var getRandomDirection = function () {
        var x = getRandomBetween(-1, 1);
        // Get y from circle equation
        //  and randomize only it's vertical direction
        //  (on top or on bottom of x axis on xircle equation graph)
        var y = (1 - x * x) * (getRandomBetween(-1, 1) > 0 ? 1 : -1);

        return {
            x: x,
            y: y
        };
    };

    var balls = [];
    var addBallToScene = function (scene, ball) {
        scene.add(ball.sphere);
        balls.push(ball);
    };
    _.each(_.range(50), function (i) {
        console.log(i);
        var direction = getRandomDirection();
        addBallToScene(
            scene,
            new Ball(
                direction.x,
                direction.y,
                getRandomBetween(0.4, 1.5),
                getRandomBetween(0, 16777215)//,
//                0x00ff00
            )
        );
    });

    var isBallYOutOfWindow = function (ball) {
        var y = ball.sphere.position.y;
        var maxY = 150;
//        var maxY = window.innerHeight / 2;
        return y <= -maxY || y >= maxY;
    };

    var isBallXOutOfWindow = function (ball) {
        var x = ball.sphere.position.x;
        var maxX = 280;
//        var maxX = window.innerWidth / 2;
        return x <= -maxX || x >= maxX;
    };


    var oldTimestamp = 0;
    var timeDelta = 0;
    var frames = 0;
    function animate (timestamp) {
        if (timestamp > 15000) {
            return;
        }

        var timestampF = parseFloat(timestamp);
        timeDelta = timestampF - oldTimestamp;
//        console.log(timestamp, timestampF, oldTimestamp, timeDelta, (new Date).getTime());

        oldTimestamp = timestampF;


        requestAnimationFrame(animate);
        render(timeDelta);
    }

//    var z = 0;
	function render (timeDelta) {
        frames++;
        // skip the first(loading) frames
        if (frames > 4) {
            _.each(balls, function (ball) {
    //            z++;if(z>300) {return;}

                var sphere = ball.sphere;

                sphere.position.x += ball.dirX * BALL_SPEED * timeDelta;
                sphere.position.y += ball.dirY * BALL_SPEED * timeDelta;

                if (isBallXOutOfWindow(ball)) {
                    ball.dirX = -ball.dirX;
                }
                if (isBallYOutOfWindow(ball)) {
                    ball.dirY = -ball.dirY;
                }
            });
        }

        stats.update();

		renderer.render(scene, camera);
	}

	requestAnimationFrame(animate);
})(window, window.requestAnimationFrame, window._, window.THREE, window.Stats, window.Ball, window.init);
