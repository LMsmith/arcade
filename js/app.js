var scoreCounter = '<h1 id="score">CLUES: %data%</h1>'
//--------------------------ENEMIES---------------------------
//Enemy weapons player must avoid
var Enemy = function(x,y,speed,sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.speed = speed;
};
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt * this.speed;
    if(this.x > 590) {
        this.x = -50;
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var rope = new Enemy(36,305,50,'images/rope.png');
var candlestick = new Enemy(36,220,122,'images/candlestick.png');
var revolver = new Enemy(495,400,100,'images/revolver.png');
var pipe = new Enemy(200,120,202,'images/pipe.png');
var wrench = new Enemy(495,120,200,'images/wrench.png');
var knife = new Enemy(350,220,125,'images/knife.png');
var allEnemies = [rope,candlestick,revolver,pipe,wrench,knife];
//------------------------------CLUES---------------------------
//Clues player should pick up to solve Mr. Boddy's murder
//Clues appear in each row, with randomized x values
var Clue = function(y) {
    this.sprite = 'images/clue.png';
    this.x = Math.random()*500 + 40;;
    this.y = y;
};
Clue.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//instantiate clues
var clue1 = new Clue(500);
var clue2 = new Clue(425);
var clue3 = new Clue(350);
var clue4 = new Clue(275);
var clue5 = new Clue(200);
var clue6 = new Clue(125);
//put clues in array
var allClues = [clue1,clue2,clue3,clue4,clue5,clue6];

//-----------------------------PLAYER-----------------------------
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    this.sprite = playerSprite;
    this.x = x;
    this.y = y;
};
//describe how player moves when allowed keys are pressed/released
Player.prototype.handleInput = function(key){
    switch(key) {
        case 'left':
        if (this.x >= 75) {
        this.x = this.x - 50;
        };
        break;
        case 'right':
        if (this.x <= 490) {
        this.x = this.x + 50;
        };
        break;
        case 'up':
        if (this.y >= 70) {
        this.y= this.y - 50;
        };
        break;
        case 'down':
        if (this.y <= 490) {
        this.y= this.y + 50;
        };
        break;
    }
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.sprite = playerSprite;
};
// Place the player object in a variable called player
var player = new Player(50,520);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
//----------------PLAYER INTERACTIONS WITH ENEMIES--------------------
//check for collisions with enemies
//player position is reset when collisions occur
var checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (player.x < allEnemies[i].x + 65 &&
       player.x + 35 > allEnemies[i].x) {
            if(player.y < allEnemies[i].y + 75 &&
           76 + player.y > allEnemies[i].y) {
                player.x = 50;
                player.y = 520;
                playerScore = 0;
                allClues.forEach(function(clue) {
                    clue.x = Math.random()*500 + 40;
                })
            }
        }
    }
};

//----------------PLAYER INTERACTIONS WITH CLUES----------------------

//check for collisions/collection of clues
//playerScore increases with clues collected
var playerScore = 0;
var collectClues = function() {
    for (var i = 0; i < allClues.length; i++) {
        if (player.x < allClues[i].x + 60 &&
       player.x + 70 > allClues[i].x) {
            if(player.y < allClues[i].y + 40 &&
           60 + player.y > allClues[i].y) {
                playerScore++;
                allClues[i].x = 1000;
            }
        }
    }
    $("#main").empty();
    var newScore = scoreCounter.replace("%data%", Math.round(playerScore));
    $("#main").prepend(newScore);
};
//-----------------------IDENTIFYING THE KILLER-------------------------


//check player's final score
//higher final score increases odds of IDing the killer
//check outcome against the decimal in the appropriate case
var winGame = function() {
    //console.log("You win");
    confirm("You have identified the killer!");
};
var loseGame = function() {
    //console.log("You lose");
    confirm("You escaped, but you could not ID the killer!");
};
var checkClues = function(){
    //generate a random number decimal to check against player's odds of winning
    var outcome = Math.random();
    switch(playerScore) {
        case 0:
        if (outcome <= .10) {
        	winGame();
            break;
        }
        else {
        	loseGame();
            break;
        }
        break;
        case 1:
        if (outcome <= .2) {
            winGame();
        	break;
        }
        else {
            loseGame();
        	break;
        }
        break;
        case 2:
        if (outcome <= .3) {
            winGame();
            break;
        }
        else {
            loseGame();
            break;
        }
        break;
        case 3:
        if (outcome <= .45) {
            winGame();
            break;
        }
        else {
            loseGame();
            break;
        }
        break;
        case 4:
        if (outcome <= .6) {
            winGame();
            break;
        }
        else {
            loseGame();
            break;
        }
        break;
        case 5:
        if (outcome <= .75) {
            winGame();
            break;
        }
        else {
            loseGame();
            break;
        }
        break;
        case 6:
        if (outcome <= .9) {
            winGame();
            break;
        }
        else {
            loseGame();
            break;
        }
        break;
    }
    player.x = 50;
    player.y = 520;
    playerScore = 0;
    allClues.forEach(function(clue) {
            clue.x = Math.random()*500 + 40;
        });
};
//check if player has gotten out of the house
var endGame = function() {
	if (player.y <= 20) {
		checkClues();
	}
};