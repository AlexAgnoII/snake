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