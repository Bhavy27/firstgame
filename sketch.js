var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var GameOver, GameOverImage;
var Restart, RestartImage;

var jumps,dies,checkpoints;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  GameOverImage = loadImage('gameOver.png');
  RestartImage = loadImage('restart.png');
  
  jumps = loadSound("jump.mp3");
  dies = loadSound("die.mp3");
  checkpoints = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
  
  score = 0
  
  GameOver = createSprite(300,100);
  GameOver.addImage(GameOverImage);
  
  Restart = createSprite(300,150);
  Restart.addImage(RestartImage);
  Restart.scale = 0.7;
}

function draw() {
  background(0);
  //displaying score
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4 + 3*score / 300);
    //scoring
    score = score + Math.round(frameCount/100);
    GameOver.visible = false;
    Restart.visible = false;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=150) {
        trex.velocityY = -13;
        jumps.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dies.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
      trex.changeAnimation('collided',trex_collided);
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      GameOver.visible = true;
      Restart.visible = true;
      trex.velocityY = 0;
     if(mousePressedOver(Restart)){
        reset();
      }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(score > 0 && score % 500 === 0){
    checkpoints.play();
  }
  drawSprites();
}

function reset(){
  gameState = PLAY;
  Restart.visible = false;
  GameOver.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score / 300);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.65;
    obstacle.lifetime = 250;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.65;
    cloud.velocityX = -(3 + score / 300);
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
