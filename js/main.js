;(function (window, requestAnimationFrame, _, THREE, Stats, Ball, init) {
	'use strict';

    var FRAME_RATE_LIMIT = 30;

    var BALL_SPEED = 0.06;

    var CANVAS_WIDTH = 280; // @TODO find a way to get these two from canvas itself
    var CANVAS_HEIGHT = 170;

    var HALF_CANVAS_WIDTH = (CANVAS_WIDTH/2);
    var HALF_CANVAS_HEIGHT = (CANVAS_HEIGHT/2);

    init();

    var scene = window.scene;
    var camera = window.camera;
    var renderer = window.renderer;
    var stats = window.stats;

    var getRandomBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    var getRandomSize = function () {
        return getRandomBetween(0.7, 2);
    };

    var getRandomColor = function () {
//        return 16777215;
        return getRandomBetween(1000000, 16777215);
    };

    var getRandomYPosition = function () {
        return getRandomBetween(-HALF_CANVAS_WIDTH + 40, HALF_CANVAS_WIDTH - 40);
    };

    var getRandomFromPosition = function () {
        return { x: -HALF_CANVAS_WIDTH + 20, y: getRandomYPosition() };
    };

    var getRandomToPosition = function () {
        return { x: HALF_CANVAS_WIDTH + 20, y: getRandomYPosition() };
    };

    var getDirection = function (fromPosition, toPosition) {
        var x1 = fromPosition.x;
        var y1 = fromPosition.y;
        var x2 = toPosition.x;
        var y2 = toPosition.y;
        // Point-slope linear equation
        // y1 - y2 = m * (x1 - x2);
        // y2 = - (m * (x1 - x2) - y1);
        // m = (y1 - y2) / (x1 - x2)
        // x changes together with time
        var m = (y2 - y1) / (x2 - x1);
        return {
            x: 1,
            y: (y2 - y1) / (x2 - x1)
        };
    };

    var getNextPosition = function (currentPosition, direction, timeDelta) {
        var nextX = currentPosition.x + direction.x * timeDelta * BALL_SPEED;
        // y = y1 + m(x-x1)
//        var nextY = currentPosition.y + direction.y * (nextX - currentPosition.x)
        var nextY = currentPosition.y + direction.y * timeDelta * BALL_SPEED;

        return { x: nextX, y: nextY };
    };

    var balls = [];
    var setBallPosition = function (ball, position) {
        ball.sphere.position.x = position.x;
        ball.sphere.position.y = position.y;
    };

    var addBallToScene = function (scene, ball, startPosition) {
        setBallPosition(ball, startPosition);

        scene.add(ball.sphere);

        balls.push(ball);
    };

    _.each(_.range(30), function (i) {
        var fromPosition = getRandomFromPosition();
        var toPosition = getRandomToPosition();

        var direction = getDirection(fromPosition, toPosition);
        addBallToScene(
            scene,
            new Ball(
                direction,
                getRandomSize(),
                getRandomColor()
            ),
            fromPosition
        );
        console.log(i, fromPosition, toPosition, direction);
    });

    var isBallYOutOfWindow = function (ball) {
        var y = ball.sphere.position.y;
        return y <= -HALF_CANVAS_HEIGHT + 10 || y >= HALF_CANVAS_HEIGHT - 10;
    };

    var isBallXOutOfWindow = function (ball) {
        var x = ball.sphere.position.x;
        return x <= -HALF_CANVAS_WIDTH + 10 || x >= HALF_CANVAS_WIDTH - 10;
    };

    var removeBalls = function (ballsToRemove) {
        if (ballsToRemove.length === 0) {
            return;
        }
        balls = _.difference(balls, ballsToRemove);
        _(ballsToRemove).each(function (ball) {
            ball.sphere.visible = false;
            scene.remove(ball.sphere);
        });
    };

    var oldTimestamp = 0;
    var timeDelta = 0;
    var frames = 0;
    function animate (timestamp) {
//        if (timestamp > 15000) {
//            return;
//        }

        var timestampF = parseFloat(timestamp);
        timeDelta = timestampF - oldTimestamp;
//        console.log(timestamp, timestampF, oldTimestamp, timeDelta, (new Date).getTime());

        oldTimestamp = timestampF;


        setTimeout( function() {
            requestAnimationFrame( animate );
        }, 1000/FRAME_RATE_LIMIT);

        render(timeDelta);
    }

//    var z = 0;
	function render (timeDelta) {
        frames++;

        _.each(balls, function (ball) {
            var sphere = ball.sphere;

            var newPosition = getNextPosition(
                sphere.position,
                ball.direction,
                timeDelta
            );

            sphere.position.x = newPosition.x;
            sphere.position.y = newPosition.y;
        });

        var ballsToRemove = [];
        _.each(balls, function (ball) {
            if (isBallXOutOfWindow(ball)) {
                ballsToRemove.push(ball);
            }
            if (isBallYOutOfWindow(ball)) {
                ballsToRemove.push(ball);
            }
        });

        removeBalls(ballsToRemove);

        stats.update();

		renderer.render(scene, camera);
	}

	requestAnimationFrame(animate);
})(window, window.requestAnimationFrame, window._, window.THREE, window.Stats, window.Ball, window.init);
