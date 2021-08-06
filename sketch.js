var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var gruponuvens;
var grupocactos;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var cacto1,cacto2,cacto3,cacto4,cacto5,cacto6;

var pontuacao;

var gameoverimage, restartimage, gameover, restart;

var sompulo, somgameover, somcheckpoint;

var novaimagem;

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  cacto1= loadImage("obstacle1.png");
  cacto2= loadImage("obstacle2.png");
  cacto3= loadImage("obstacle3.png");
  cacto4= loadImage("obstacle4.png");
  cacto5= loadImage("obstacle5.png");
  cacto6= loadImage("obstacle6.png");
 
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  
  sompulo = loadSound("jump.mp3");
  somgameover = loadSound("die.mp3");
  somcheckpoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 //trex createSprite
  trex = createSprite(50,height-40,20,50);
  
 //main animation
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided",trex_colidiu);
  trex.scale = 0.5;
  
 //collider trex
  //trex.debug=true;
  //trex.setCollider("rectangle",0,0,400,trex.width, trex.heigth);
  trex.setCollider("circle",0,0,40);
  
 //solo createSprite
  solo = createSprite(200,height-20,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
 //solo invisivel
  soloinvisivel = createSprite(200,height-10,400,10);
  soloinvisivel.visible = false;
  
  //console.log("Oi"+ 5)
  
 //Pontuação
  pontuacao = 0;
  
 //GameOver
  gameover = createSprite(width/2,height/2-40);
  gameover.addImage(gameoverimage);
  gameover.scale = 0.5;
  
 //Restart
  restart = createSprite(width/2,height/2);
  restart.addImage(restartimage);
  restart.scale = 0.5;
  
 //Grupos
  gruponuvens = new Group ();
  grupocactos = new Group ();
  
}

function draw() {
  background(180);
  
 //text Pontuação
  text ("Pontuação:"+pontuacao,15,20);
  
  if(estadoJogo===JOGAR){
    solo.velocityX = -(4+pontuacao/100);
    pontuacao=pontuacao+Math.round(frameRate()/60);
    
   //Pulo keyDown "space"
    if((touches.length>0||keyDown("space"))&& trex.y >= height-40) {
     trex.velocityY = -10;
     sompulo.play();
     touches = [];
    }
   //trex velocityY
    trex.velocityY = trex.velocityY + 0.8
    
   //gerar as nuvens
    gerarNuvens();
    
   //gerar os cactos;
    gerarCactos();
    
   //gameover visibility
    gameover.visible = false;
    restart.visible = false;
    
   //pontuação
    if(pontuacao>0 && pontuacao % 100 === 0){
     somcheckpoint.play();
   }
    
   if(trex.isTouching(grupocactos)){
     estadoJogo = ENCERRAR;
     somgameover.play();
     //trex.velocityY = -10;
     //sompulo.play();
   }
  }
  
  else if(estadoJogo===ENCERRAR){
    
  //objects velocity
   solo.velocityX = 0;
   trex.velocityY = 0;
   gruponuvens.setVelocityXEach(0);
   grupocactos.setVelocityXEach(0);
    
  //group lifetime
   gruponuvens.setLifetimeEach(-1);
   grupocactos.setLifetimeEach(-1);
    
  //trex changeAnimation
   trex.changeAnimation("collided",trex_colidiu);
    
  //gameover visibility
   gameover.visible = true;
   restart.visible = true;
  //restart button
   if(touches.length>0||mousePressedOver(restart)){
    reset();
    touches = [];
   }
    
  }
  
 //solo loop
  if (solo.x < 0){
    solo.x = solo.width/2;
  }
  
 //trex collide
  trex.collide(soloinvisivel);
  
 //console.log(frameCount);
  
  drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  grupocactos.destroyEach();
  gruponuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0;
}

function gerarNuvens() {
  
  //gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width+20,height/2,40,10);
    nuvem.addImage(imagemdanuvem)
    nuvem.y = Math.round(random(10,60))
    nuvem.scale = 0.4;
    nuvem.velocityX = -(2+pontuacao/100);
    nuvem.lifetime = width;
    
  //ajustando a profundidade
    nuvem.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    gruponuvens.add(nuvem);
    
  }
}

function gerarCactos(){
  
  if (frameCount % 60 === 0) {
   var cacto = createSprite(width+20,height-35,10,40);
    cacto.velocityX = -(6+pontuacao/100);
    cacto.scale = 0.5;
    cacto.lifetime = width;
    
  //random image
   var rand = Math.round(random(1,6));
    switch(rand){
      case 1: cacto.addImage(cacto1);
      break;
      case 2: cacto.addImage(cacto2);
      break;
      case 3: cacto.addImage(cacto3);
      break;
      case 4: cacto.addImage(cacto4);
      break;
      case 5: cacto.addImage(cacto5);
      break;
      case 6: cacto.addImage(cacto6);
      break;
    default:break;
    }
    
    grupocactos.add(cacto);
    
  }
  
}