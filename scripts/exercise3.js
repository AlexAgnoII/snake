"use strict";



let app = new PIXI.Application({ 
    width: 700, 
    height: 700,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

let state;

let snakeLogo

let SNAKE_LOGO = "images/snakelogo.png",
    PLAY_IMG = "images/play.png",
    LEVEL_1_IMG = "images/level1.png",
    LEVEL_2_IMG = "images/level2.png",
    LEVEL_3_IMG = "images/level3.png",
    SPEED_1 = 50,
    SPEED_2 = 125,
    SPEED_3 = 215;

PIXI.loader
    .add([])
    .load(setup);

function setup() {
    
    initializeTitle();
    
    state = play();
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
    
}