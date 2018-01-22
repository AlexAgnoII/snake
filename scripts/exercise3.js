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
    selectedLevel,
    selectedLevelValue,
    level1Button,
    level2Button,
    level3Button;

let curentScore,
    highScore,
    scoreMessage;

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

let SNAKE_LOGO = "images/snakelogo.png",
    PLAY_IMG = "images/play.png",
    LEVEL_1_IMG = "images/level1.png",
    LEVEL_2_IMG = "images/level2.png",
    LEVEL_3_IMG = "images/level3.png",
    SPEED_1 = 50,
    SPEED_2 = 125,
    SPEED_3 = 215;


gameDiv.appendChild(app.view);

PIXI.loader
    .add([SNAKE_LOGO, 
          PLAY_IMG,
          LEVEL_1_IMG, 
          LEVEL_2_IMG, 
          LEVEL_3_IMG])
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
    
    scoreMessage = new PIXI.Text("High Score: ", style);
    scoreMessage.anchor.set(0.5, 0.5);
    scoreMessage.position.set(gameWidth / 3, gameHeight / 3)
    titleScene.addChild(scoreMessage);
    
    highScore = new PIXI.Text("123123123", style);
    highScore.anchor.set(0, 0.5);
    highScore.position.set(gameWidth / 2, gameHeight / 3);
    titleScene.addChild(highScore);
    
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
    
    playScene.visible = false;

}

function initializeEnd() {
    endScene = new PIXI.Container();
    app.stage.addChild(endScene);
    
    endScene.visible = false;  
}