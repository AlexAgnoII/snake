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

let state,
    titleScene,
    playScene,
    endScene;

let snakeLogo,
    playButton,
    backButton,
    selectedLevel,
    selectedLevelValue,
    selectedActualValue,
    level1Button,
    level2Button,
    level3Button;

let curentScore = 0,
    highScore = 0, //contains highscore from storage.
    titlehighScore,
    titlescoreMessage,
    endMessage,
    endScoreValue,
    endScoreMessage,
    endHighScoreMsg,
    endHighScoreVal,
    endHint;

let snakeBody = [],
    snakeMove,
    up,
    down,
    left,
    right,
    customVY,
    customVX;


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

const SNAKE_LOGO = "images/snakelogo.png",
      PLAY_IMG = "images/play.png",
      LEVEL_1_IMG = "images/level1.png",
      LEVEL_2_IMG = "images/level2.png",
      LEVEL_3_IMG = "images/level3.png",
      END_IMG = "images/gameover.png",
      BACK_IMG = "images/back.png",
      SPEED_1 = 5,
      SPEED_2 = 10,
      SPEED_3 = 15,
      SNAKE_INITIAL_SIZE = 3;


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
    }
    console.log(selectedActualValue)
   snakeBody[0].x += snakeBody[0].vx * selectedActualValue;
   snakeBody[0].y += snakeBody[0].vy * selectedActualValue;
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

function changeLevel(level) {
    selectedLevelValue.text = level;
}

function initializePlay() {
    playScene = new PIXI.Container();
    app.stage.addChild(playScene);
    
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

function initializeSnakeBody() {
    let currX, currY;
    for(let i = 0; i < SNAKE_INITIAL_SIZE; i++) {
        snakeBody.push(createSnake());
        
        //first, meaning head.
        if(i === 0 ) {
            snakeBody[i].position.set(gameWidth/2, gameHeight/2);
            currX = gameWidth/2;
            currY = gameHeight/2;
        }
        else {
            currY += snakeBody[i].height;
            snakeBody[i].position.set(currX, currY);
        }
    }
    
    //initialize move for the head ONLY.
    up = keyboard(38);
    down = keyboard(40);
    left = keyboard(37);
    right = keyboard(39);
    snakeMove = up;
    
    snakeBody[0].vx = 0
    snakeBody[0].vy = 0
    
    up.press = function() {
        snakeBody[0].vx = 0;
        snakeBody[0].vy = -1;
        snakeMove = up;
        console.log("up")
        console.log(snakeBody[0].vx)
    }

    down.press = function() {
        snakeBody[0].vx = 0;
        snakeBody[0].vy = +1;
        snakeMove = down;
        console.log("down")
        console.log(snakeBody[0].vx)
    }

    left.press = function() {
        snakeBody[0].vx = -1;
        snakeBody[0].vy = 0;
        snakeMove = left;
        console.log("left")
                console.log(snakeBody[0].vy)
    }
    
    right.press = function() {
        snakeBody[0].vx = +1;
        snakeBody[0].vy = 0;
        snakeMove = right;
        console.log("right")
                console.log(snakeBody[0].vy)
    }
}

function createSnake() {
    let snake = new PIXI.Graphics();
    snake.lineStyle(2, 0xffffff, 1);
    snake.beginFill(0xff0000);
    snake.drawRect(0, 0, 35, 35);
    snake.endFill();
    
    playScene.addChild(snake);
    return snake;
}