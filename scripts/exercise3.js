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
    level1Button,
    level2Button,
    level3Button;

let curentScore,
    highScore,
    scoreMessage;

let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fill: '#ff3300',
  stroke: "#000000",
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: "white",
  dropShadowBlur: 4,
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
    
    state = title;
    app.ticker.add(delta => gameLoop());
}

function gameLoop() {
    state();
}

function title() {
    
}

function play() {
    
}

function end() {
    
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
        console.log("play!")
    })
    titleScene.addChild(playButton);
    
}