/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 606;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
        //append score bar to the page
        var originalScore = scoreCounter.replace("%data%", 0);
        $("#score").prepend(originalScore);
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        collectClues();
        endGame();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    var mouseX = 0;
    var mouseY = 0;
    //draw the start page to the canvas
    function drawStart() {
        ctx.drawImage(Resources.get('images/start.png'), 0, 0);
        document.addEventListener('click', startScreen, false);
    }
    //check if player has clicked on a character
    //number of times the screen has been clicked
    var clickCount = 0;
    function startScreen(e) {
        mouseY = e.pageY;
        mouseX = e.pageX;
        //if mouseY is in the correct range, check mouseX
        if (420 < mouseY < 530) {
            document.addEventListener('click', choosePlayer, false);
            function choosePlayer(e) {
                //only proceed if a character has not already been chosen
                if (clickCount === 0) {
                    //check which pawn the user has clicked
                    if (mouseX <= 395) {
                        playerSprite = 'images/green.png';
                    } else if (mouseX <= 480) {
                        playerSprite = 'images/scarlet.png';
                    } else if (mouseX <= 565) {
                        playerSprite = 'images/mustard.png';
                    } else if (mouseX <= 650) {
                        playerSprite = 'images/peacock.png';
                    } else if (mouseX <= 735) {
                        playerSprite = 'images/plum.png';
                    } else {
                        playerSprite = 'images/white.png';
                    }
                    clickCount++;
                }
            }
            choosePlayer();
            init();
        }
    }
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [

                'images/grass.png',
                'images/tile.png',
                'images/tile.png',
                'images/tile.png',
                'images/tile.png',
                'images/carpet.png'
            ],
            numRows = 6,
            numCols = 6

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 101);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allClues.forEach(function(clue) {
            clue.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();

    }

    Resources.load([
        'images/tile.png',
        'images/grass.png',
        'images/scarlet.png',
        'images/mustard.png',
        'images/peacock.png',
        'images/plum.png',
        'images/green.png',
        'images/white.png',
        'images/knife.png',
        'images/revolver.png',
        'images/rope.png',
        'images/candlestick.png',
        'images/pipe.png',
        'images/wrench.png',
        'images/clue.png',
        'images/carpet.png',
        'images/start.png'
    ]);
    Resources.onReady(drawStart);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
