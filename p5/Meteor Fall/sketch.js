//Variáveis e Classes
let stars = [];
let numStars = 250;
let shipX = -100;
let moonCraters = [];
let meteors = [];
let yodaX = 600, yodaY = 450;
let yodaAlive = true;
let survivalTime = 0;
let bestTime = 0;
let meteorSpawnRate = 0.03;
let bgMusic;
let gameState = "menu";

//Carrega previamente o som
function preload() {
  bgMusic = loadSound('musicaFundoStarWars.mp3');
  bgMusic.setVolume(0.05);
}

//Inicia algumas coisas
function setup() {
  createCanvas(1200, 600);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.6),
      brightness: random(150, 255),
      speed: random(0.01, 0.03)
    });
  }

  for (let i = 0; i < 5; i++) {
    moonCraters.push({
      x: width * 0.65 + random(-30, 30),
      y: height * 0.25 + random(-30, 30),
      size: random(8, 15)
    });
  }
  for (let i = 0; i < 3; i++) {
    moonCraters.push({
      x: width * 0.75 + random(-20, 20),
      y: height * 0.3 + random(-20, 20),
      size: random(6, 12)
    });
  }
}

//Desenha o fundo e define o que deve ser desenhado
function draw() {
  background(10, 10, 30);
  drawStars();

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "gameOver") {
    drawGameOver();
  }
}

//Desenha o menu
function drawMenu() {
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Meteor Fall", width / 2, height / 3);
  
  drawButton(width / 2 - 75, height / 2, 150, 50, "Jogar", () => {
    startGame();
  });
}

//Desenha o jogo em si
function drawGame() {
  drawMoons();
  drawLandscape();
  drawShip();
  
  if (yodaAlive) {
    drawYoda();
    drawMeteors();
    survivalTime += deltaTime / 1000;

    if (frameCount % 300 === 0) {
      meteorSpawnRate += 0.005;
    }
    
    if (random(1) < meteorSpawnRate) {
      meteors.push(new Meteor());
    }

    fill(255);
    textSize(24);
    text(`Tempo: ${survivalTime.toFixed(1)}s`, 100, 40);
  } else {
    gameState = "gameOver";
  }
}

//Desenha a tela de Game Over
function drawGameOver() {
  background(0);
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 3);
  textSize(30);
  text(`Tempo Sobrevivido: ${survivalTime.toFixed(1)}s`, width / 2, height / 2);
  if (survivalTime > bestTime){
    bestTime = survivalTime
  }
  fill(200,200,220);
  textSize(29);
  text(`Melhor Tempo: ${bestTime.toFixed(1)}s`, width / 2, height / 2 + 40);
  bgMusic.stop();
  
  drawButton(width / 2 - 100, height / 2 + 80, 200, 50, "Reiniciar", () => {
    resetGame();
  });
  return bestTime;
}

//Desenha o botão
function drawButton(x, y, w, h, label, callback) {
  fill(100);
  rect(x, y, w, h, 10);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);

  if (mouseIsPressed && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    callback();
  }
}

//Inicia o jogo e a musica
function startGame() {
  gameState = "playing";
  bgMusic.loop();
  bgMusic.jump(3)
  resetGame();
}

//Reseta o jogo
function resetGame() {
  bgMusic.loop();
  bgMusic.jump(3);
  yodaAlive = true;
  survivalTime = 0;
  meteors = [];
  meteorSpawnRate = 0.03;
  gameState = "playing";
}

//Desenha as estrelas
function drawStars() {
  noStroke();
  for (let star of stars) {
    let flicker = sin(frameCount * star.speed) * 50;
    fill(star.brightness + flicker);
    ellipse(star.x, star.y, 2, 2);
  }
}

//Desenha as luas
function drawMoons() {
  fill(200);
  ellipse(width * 0.65, height * 0.25, 100, 100);
  fill(180);
  ellipse(width * 0.75, height * 0.3, 70, 70);
  
  fill(160);
  for (let crater of moonCraters) {
    ellipse(crater.x, crater.y, crater.size, crater.size);
  }
}

//Desenha as montanhas
function drawLandscape() {
  noStroke();
  fill(80, 80, 90);
  beginShape();
  for (let x = 0; x <= width; x += 20) {
    let y = height * 0.7 + noise(x * 0.005) * 100;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

//Desenha a nave que fica passando na tela
function drawShip() {
  let shipY = height * 0.4 + sin(frameCount * 0.02) * 10;
  fill(180);
  ellipse(shipX, shipY, 40, 20);
  fill(150);
  ellipse(shipX - 15, shipY, 20, 10);
  fill(255, 100, 0, 150);
  triangle(shipX - 25, shipY, shipX - 40, shipY - 5, shipX - 40, shipY + 5);
  shipX += 1;
  if (shipX > width + 50) {
    shipX = -50;
  }
}

//Desenha o Yoda
function drawYoda() {
  // Corpo
  fill(100, 50, 0); 
  rect(yodaX - 20, yodaY, 40, 60, 10); // Roupa
  fill(80, 40, 0);
  rect(yodaX - 10, yodaY + 10, 20, 40, 5); // Detalhe na roupa (cinto)

  // Cabeça
  fill(50, 150, 50);
  ellipse(yodaX, yodaY - 20, 40, 40); // Cabeça

  // Orelhas detalhadas
  fill(50, 120, 50);
  triangle(yodaX - 20, yodaY - 30, yodaX - 50, yodaY - 40, yodaX - 20, yodaY - 10);
  triangle(yodaX + 20, yodaY - 30, yodaX + 50, yodaY - 40, yodaX + 20, yodaY - 10);
  fill(30, 90, 30);
  triangle(yodaX - 20, yodaY - 30, yodaX - 40, yodaY - 35, yodaX - 20, yodaY - 15);
  triangle(yodaX + 20, yodaY - 30, yodaX + 40, yodaY - 35, yodaX + 20, yodaY - 15);

  // Rosto
  fill(0);
  ellipse(yodaX - 10, yodaY - 20, 7, 7); // Olho esquerdo
  ellipse(yodaX + 10, yodaY - 20, 7, 7); // Olho direito
  fill(255,255,255)
  ellipse(yodaX - 10, yodaY - 22, 2, 2); // Olho esquerdo
  ellipse(yodaX + 10, yodaY - 22, 2, 2); // Olho direito

  // Mãos
  fill(50, 150, 50);
  ellipse(yodaX - 25, yodaY + 30, 10, 10); // Mão esquerda
  ellipse(yodaX + 25, yodaY + 30, 10, 10); // Mão direita
}


function mouseMoved() {
  yodaX = constrain(mouseX, 20, width - 20);
}

//Classe para os meteoros
class Meteor {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.size = random(15, 25);
    this.speed = random(2, 4);
    this.trail = [];
  }

  update() {
    this.y += this.speed;
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();
  }

  show() {
    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 50, 200);
      fill(255, 100, 0, alpha);
      ellipse(this.trail[i].x, this.trail[i].y, this.size * 0.5);
    }
    fill(150);
    ellipse(this.x, this.y, this.size);
  }
//Quando sai da tela, volta pro começo
  offScreen() {
    return this.y > height;
  }
}

//Desenha os meteoros a partir da classe
function drawMeteors() {
  for (let i = meteors.length - 1; i >= 0; i--) {
    meteors[i].update();
    meteors[i].show();
    if (dist(meteors[i].x, meteors[i].y, yodaX, yodaY) < meteors[i].size / 2 + 20) {
      yodaAlive = false;
    }
    if (meteors[i].offScreen()) {
      meteors.splice(i, 1);
    }
  }
}
