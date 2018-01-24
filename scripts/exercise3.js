"use strict";

let gameDiv = document.getElementById("game");
const gameHeight = gameDiv.offsetHeight;
const gameWidth = gameDiv.offsetWidth;
let app = new PIXI.Application({ 
    width: gameHeight, 
    height: gameWidth,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

const SNAKE_LOGO = "images/snakelogo.png",
      PLAY_IMG = "images/play.png",
      LEVEL_1_IMG = "images/level1.png",
      LEVEL_2_IMG = "images/level2.png",
      LEVEL_3_IMG = "images/level3.png",
      END_IMG = "images/gameover.png",
      BACK_IMG = "images/back.png",
      SPEED_1 = 1,
      SPEED_2 = 2,
      SPEED_3 = 3,
      SNAKE_INITIAL_LENGTH = 10,
      SNAKE_SIZE = 15, //refers to size of snake in terms of H and W;
      FOOD_AREA_SPAWN_LIMIT = 70; //refers to the limit (x pixels away from the walls) where food can be spawned 

let state,
    titleScene,
    playScene,
    endScene;

//All these are image holders
let snakeLogo,
    playButton,
    backButton,
    selectedLevel,
    selectedLevelValue,
    level1Button, 
    level2Button,
    level3Button;

let curentScore = 0, //VALUE
    highScore = 0, //contains highscore from storage. VALUE
    selectedActualValue, //VALUE
    titlehighScore, //TEXT
    titlescoreMessage,//TEXT
    playScoreMessage, //TEXT
    playScoreValue, //TEXT
    endMessage,//TEXT
    endScoreValue,//TEXT
    endScoreMessage,//TEXT
    endHighScoreMsg,//TEXT
    endHighScoreVal,//TEXT
    endHint;//TEXT

let snakeHead,
    snakeBody = [],
    snakeMove,
    snakeCurrentLength = SNAKE_INITIAL_LENGTH,
    originalX,
    originalY,
    food,
    activeFood = false,
    up,
    down,
    left,
    right,
    frameDelay;


let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 30,
  fill: 'white',
  stroke: "#000000",
  strokeThickness: 1,
  dropShadow: true,
  dropShadowColor: "white",
  dropShadowBlur: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 1,
});



gameDiv.appendChild(app.view);

PIXI.loader
    .add([SNAKE_LOGO, 
          PLAY_IMG,
          LEVEL_1_IMG, 
          LEVEL_2_IMG, 
          LEVEL_3_IMG,
          END_IMG,
          BACK_IMG])
    .load(setup);

function setup() {
    
    initializeTitle();
    initializePlay();
    initializeEnd();

    state = title;
    app.ticker.add(delta => gameLoop());
}

function gameLoop() {
    state();
}

function title() {
    if(!titleScene.visible) {
        titleScene.visible = true;
        playScene.visible = false;
        endScene.visible = false;       
    }
}

function play() {
    if(!playScene.visible) {
        playScene.visible = true;
        endScene.visible = false;
        titleScene.visible = false;
        determineSpeed();
        reset();
        frameDelay = SNAKE_SIZE;
    }
    
   moveSnake();
   snakeWrap();
    
   if(!activeFood)
       spawnFood();
    
    //Once eaten, make food dissapear.
   if(hit(food, snakeHead)) {
       snakeCurrentLength++;
       //console.log("EATEN");
       curentScore++;
       playScoreValue.text = curentScore;
       
       playScene.removeChild(food);
       activeFood = false;
    }
    
//    if(checkForBodyHit()) {
//        alert("DEAD");
//    }
}

function checkForBodyHit() {
    for(let i = 0; i < snakeCurrentLength; i++) {
        if(hit(snakeBody[i], snakeHead)) {
           return true;
        }
    }
           
    return false;
}

function end() {
    if(!endScene.visible) {
        endScene.visible = true;
        playScene.visible = false;
        titleScene.visible = false;         
    }
}

function initializeTitle() {
    titleScene = new PIXI.Container();
    app.stage.addChild(titleScene);
    
    snakeLogo = new PIXI.Sprite(PIXI.loader.resources[SNAKE_LOGO].texture);
    snakeLogo.position.set(gameWidth / 2, 0);
    snakeLogo.anchor.set(0.5, 0);
    titleScene.addChild(snakeLogo);
    
    playButton = new PIXI.Sprite(PIXI.loader.resources[PLAY_IMG].texture);
    playButton.position.set(gameWidth / 2, gameHeight);
    playButton.scale.set(0.5, 0.5);
    playButton.anchor.set(0.5, 1);
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("pointerdown", function() {
        console.log("play!");
        state = play;
    })
    titleScene.addChild(playButton);
    
    titlescoreMessage = new PIXI.Text("High Score: ", style);
    titlescoreMessage.anchor.set(0.5, 0.5);
    titlescoreMessage.position.set(gameWidth / 3, gameHeight / 3)
    titleScene.addChild(titlescoreMessage);
    
    titlehighScore = new PIXI.Text(highScore, style);
    titlehighScore.anchor.set(0, 0.5);
    titlehighScore.position.set(gameWidth / 2, gameHeight / 3);
    titleScene.addChild(titlehighScore);
    
    level1Button = new PIXI.Sprite(PIXI.loader.resources[LEVEL_1_IMG].texture);
    level1Button.position.set(gameWidth / 4, gameHeight / 2 + 100);
    level1Button.anchor.set(0.5, 0.5);
    level1Button.interactive = true;
    level1Button.buttonMode = true;
    level1Button.on("pointerdown", () => changeLevel("1"));
    titleScene.addChild(level1Button);

    
    level2Button = new PIXI.Sprite(PIXI.loader.resources[LEVEL_2_IMG].texture);
    level2Button.position.set(gameWidth / 2, gameHeight / 2 + 100);
    level2Button.anchor.set(0.5, 0.5);
    level2Button.interactive = true;
    level2Button.buttonMode = true;
    level2Button.on("pointerdown", () => changeLevel("2"));
    titleScene.addChild(level2Button);
    
    
    level3Button = new PIXI.Sprite(PIXI.loader.resources[LEVEL_3_IMG].texture);
    level3Button.position.set(gameWidth / 2 + 175, gameHeight / 2 + 100);
    level3Button.anchor.set(0.5, 0.5);
    level3Button.interactive = true;
    level3Button.buttonMode = true;
    level3Button.on("pointerdown", () => changeLevel("3"));
    titleScene.addChild(level3Button);
    
    selectedLevel = new PIXI.Text("Selected Level: ", style);
    selectedLevel.position.set(gameWidth/3, gameHeight/2);
    selectedLevel.anchor.set(0.5, 0.5);
    titleScene.addChild(selectedLevel);
    
    selectedLevelValue = new PIXI.Text("0", style);
    selectedLevelValue.anchor.set(0, 0.5);
    selectedLevelValue.position.set(gameWidth / 2 + 80, gameHeight / 2);
    selectedLevelValue.text = "1";
    titleScene.addChild(selectedLevelValue);
    titleScene.visible = true;
}

function initializePlay() {
    playScene = new PIXI.Container();
    app.stage.addChild(playScene);
    
    playScoreMessage = new PIXI.Text("Score: ", style);
    playScene.addChild(playScoreMessage);
    
    playScoreValue = new PIXI.Text(curentScore, style);
    playScoreValue.position.set(gameWidth / 6, 0);
    playScene.addChild(playScoreValue);
    
    
    initializeSnakeBody();
    playScene.visible = false;
}

function initializeEnd() {
    endScene = new PIXI.Container();
    app.stage.addChild(endScene);
    
    endMessage = new PIXI.Sprite(PIXI.loader.resources[END_IMG].texture);
    endMessage.position.set(gameWidth / 2, gameHeight / 4);
    endMessage.scale.set(0.6, 0.6);
    endMessage.anchor.set(0.5,0.5);
    endScene.addChild(endMessage);
    
    backButton = new PIXI.Sprite(PIXI.loader.resources[BACK_IMG].texture);
    backButton.position.set(gameWidth / 2, gameHeight - 100);
    backButton.scale.set(0.2, 0.2);
    backButton.anchor.set(0.5, 1);
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on("pointerdown", function() {
        console.log("back to title")
        state = title;
    }); 
    endScene.addChild(backButton);
    
    endScoreMessage = new PIXI.Text("Your score: ", style);
    endScoreMessage.position.set(gameWidth/2, gameHeight/2);
    endScoreMessage.anchor.set(1, 0.5);
    endScene.addChild(endScoreMessage);
    
    endScoreValue = new PIXI.Text(curentScore, style);
    endScoreValue.position.set(gameWidth/2 + 40, gameHeight/2);
    endScoreValue.anchor.set(0, 0.5);
    endScene.addChild(endScoreValue);
    
    endHighScoreMsg = new PIXI.Text("High Score: ", style);
    endHighScoreMsg.position.set(gameWidth/2, gameHeight/2 + 50);
    endHighScoreMsg.anchor.set(1, 0.5);
    endScene.addChild(endHighScoreMsg);
    
    console.log(highScore)
    endHighScoreVal = new PIXI.Text(highScore, style);
    endHighScoreVal.position.set(gameWidth/2 + 40, gameHeight/2 + 50);
    endHighScoreVal.anchor.set(0, 0.5);
    endScene.addChild(endHighScoreVal);
    
    endHint = new PIXI.Text('( Retry again by pressing "R" )', style);
    endHint.position.set(gameWidth/2, gameHeight - 450);
    endHint.scale.set(0.6, 0.6);
    endHint.anchor.set(0.5, 1);
    endScene.addChild(endHint);
    
    
    
    endScene.visible = false;  
}

function initializeSnakeBody() {
    snakeHead = createSnake();    
    snakeHead.position.set(gameWidth/2, gameHeight/2);
    
    originalX = snakeHead.x;
    originalY = snakeHead.y;

    //initialize move 
    up = keyboard(38);
    down = keyboard(40);
    left = keyboard(37);
    right = keyboard(39);
    
    //initialize snake going up
    snakeMove = up;
    snakeHead.vx = 0;
    snakeHead.vy = -1;
    

    up.press = function() {
        if(snakeMove != up && snakeMove != down) {
            snakeHead.vx = 0;
            //snakeHead.vy = -1;
            snakeHead.vy = -SNAKE_SIZE;
            snakeMove = up; 
        }
    }

     down.press = function() {
        if(snakeMove != down && snakeMove != up) {
            snakeHead.vx = 0;
            //snakeHead.vy = 1;
            snakeHead.vy = SNAKE_SIZE;
            snakeMove = down;   
        }
    }

    left.press = function() {
        if(snakeMove != left && snakeMove != right) {
            //snakeHead.vx = -1;
            snakeHead.vx = -SNAKE_SIZE;
            snakeHead.vy = 0;
            snakeMove = left;
        }

    }

    right.press = function() {
        if(snakeMove != right && snakeMove != left) {
            //snakeHead.vx = 1;
            snakeHead.vx = SNAKE_SIZE;
            snakeHead.vy = 0;
            snakeMove = right;
        }

    }
}


function determineSpeed() {
    let temp = selectedLevelValue.text;
            
    if(temp === "1") {
        selectedActualValue = SPEED_1;
    }
    else if(temp === "2") {
        selectedActualValue = SPEED_2;
    }
    else {    
        selectedActualValue = SPEED_3;
    }
}

function changeLevel(level) {
    selectedLevelValue.text = level;
}

function createSnake() {
    let snake = new PIXI.Graphics();
    snake.lineStyle(1, 0xFFFFFF, 1);
    snake.beginFill(0xff0000);
    snake.drawRect(0, 0, SNAKE_SIZE, SNAKE_SIZE);
    snake.endFill();
    
    console.log(snake.width);
    console.log(snake.height);
    playScene.addChild(snake);
    return snake;
}

function snakeWrap() {
    
    //right
    //console.log(snakeHead.x)
    //console.log(snakeHead.y)
    
    if(snakeHead.x + snakeHead.width > gameWidth) {
       // console.log("right")
        snakeHead.x = 0;
    }
    
    //up
    if(snakeHead.y < 0) {
        snakeHead.y = gameHeight - snakeHead.height;
        //console.log("up")
    }
    
    //down
    if(snakeHead.y + snakeHead.height > gameHeight) {
        snakeHead.y = 0;
        //console.log("down")
    }
    
    if(snakeHead.x < 0) {
        snakeHead.x = gameWidth - snakeHead.width;
        //console.log("left")
    }
}

function moveSnake() {

   
   // frameDelay -= selectedActualValue;
    //if(frameDelay <= 0) {
        let snake = createSnake();
        snakeHead.x += snakeHead.vx * selectedActualValue;
        snakeHead.y += snakeHead.vy * selectedActualValue;
        snake.x = originalX;
        snake.y = originalY;

        
        originalX = snakeHead.x;
        originalY = snakeHead.y;
        //frameDelay = SNAKE_SIZE;
        snakeBody.push(snake);
        
        if(snakeBody.length > snakeCurrentLength) {
            playScene.removeChild(snakeBody[0])
            snakeBody.splice(0, 1);    
        }
    //}

    
  
}

function spawnFood() {
    let randomX = getRandomInt(FOOD_AREA_SPAWN_LIMIT, 
                               Math.abs(gameWidth - FOOD_AREA_SPAWN_LIMIT)),
        randomY= getRandomInt(FOOD_AREA_SPAWN_LIMIT, 
                              Math.abs(gameHeight - FOOD_AREA_SPAWN_LIMIT));
    
    food = new PIXI.Graphics();
    food.lineStyle(2, 0x114FFA, 1);
    food.beginFill(0x114FFA);
    food.drawRect(0, 0, 5, 5);
    food.endFill();
    
    //random again if food collides to any of the body.
    food.x = randomX;
    food.y = randomY;
    playScene.addChild(food);
    activeFood = true
    
}

function reset() {
    curentScore = 0;
    //delete snake and food
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}



function hit(r1, r2) {
    let hit;
    hit = false;
    
    if(typeof r1 != "undefined" && typeof r2 != "undefined") {

      //Define the variables we'll need to calculate
      let combinedHalfWidths, combinedHalfHeights, vx, vy;


      //Find the center points of each sprite
      r1.centerX = r1.x + r1.width / 2;
      r1.centerY = r1.y + r1.height / 2;
      r2.centerX = r2.x + r2.width / 2;
      r2.centerY = r2.y + r2.height / 2;

      //Find the half-widths and half-heights of each sprite
      r1.halfWidth = r1.width / 2;
      r1.halfHeight = r1.height / 2;
      r2.halfWidth = r2.width / 2;
      r2.halfHeight = r2.height / 2;

      //Calculate the distance vector between the sprites
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      //Check for a collision on the x axis
      if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

          //There's definitely a collision happening
          hit = true;
        } else {

          //There's no collision on the y axis
          hit = false;
        }
      } else {

        //There's no collision on the x axis
        hit = false;
      }
  }

  return hit;

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
