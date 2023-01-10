const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

let frame = 0;

//Set Variable
const startRaven = 10;
const startBird = 5;
const startEndTimer = 40;

const startTotalEnemy = startRaven + startBird;
const winningScore = ((startRaven*10) + (startBird*20)); //Raven - 10 Points // Bird - 20 Points


//Current Game Variable
let currentScore = 0;
let totalEnemy = startTotalEnemy;

let timerSeconds = 0;
let endTimer = startEndTimer;

let gameFailed = false;
let gameSuccess = false;

//Audio
let gunShot = new Audio('gunShot.mp3')
let hitMark = new Audio('hitMark.mp3')


const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

let canvasPosition = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener('mouseleave', function(e) {
    mouse.x = undefined;
    mouse.y = undefined;
});

let characters = [];

class Character {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    draw(){
    }

    update() {
    }
};

class Player extends Character{
    constructor(){
        super(0, 550)
        this.width = 320;
        this.height = 180;
        this.image = new Image();
        this.image.src = "gun.png"
        this.image2 = new Image();
        this.image2.src = "crosshair.png"
        this.frame = 0;
        this.staggerFrame = 15;
        this.shoot = false;
    }

    draw(){
        if(!this.shoot){
            ctx.drawImage(this.image, 
                0 * this.width, 0, 
                this.width, this.height,
                mouse.x, this.y, 
                this.width, this.height);
                
            ctx.drawImage(this.image2, 
                0 * 64, 0,
                64, 64,
                mouse.x - 32, mouse.y - 32,
                64, 64);
        }
        else{
            if(this.frame == 5){
                this.frame = 0;
                this.shoot = false;
            }

            if(frame % this.staggerFrame == 0){
    
                this.frame++;
            }
            
            ctx.drawImage(this.image, 
                this.frame * this.width, 0,
                this.width, this.height,
                mouse.x, this.y,
                this.width, this.height);
        }
    }

    update() {
    }
};

class Enemy extends Character{
    constructor(x,y){
        super(Math.floor(Math.random() * 1280), 500)
        this.width = 128;
        this.height = 128;
        this.image = new Image();
        this.staggerFrame = 5;
        this.image.src = "raven.png"
        this.frame = 0;
        this.originX = 0;
        this.originY = 0;
        this.destinationX = 0;
        this.destinationY = 0;
        this.originTimer = 0;
        this.timer = 0;
        this.score = 10;
    }

    draw(){
        if(this.frame == 5){
            this.frame = 0;
        }

        if(frame % this.staggerFrame == 0){
            this.frame++;
        }
        
        ctx.drawImage(this.image, 
            this.frame * this.width, 0,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height);
    }

    update() {
        if(this.timer == 0){
            this.originTimer = Math.floor(Math.random() * 200) + 120;
            this.timer = this.originTimer;
            this.originX = this.x;
            this.originY = this.y;
            this.destinationX = Math.floor(Math.random() * 1280);
            this.destinationY = Math.floor(Math.random() * 500);
        }

        if(Math.hypot(this.destinationX - this.x, this.destinationY - this.y) < 10){
            this.x = this.destinationX;
            this.y = this.destinationY;
        }

        this.x = lerp(this.originX, this.destinationX, 1 - this.timer/this.originTimer);
        this.y = lerp(this.originY, this.destinationY, 1 - this.timer/this.originTimer);

        this.timer--;
    }
};
class Enemy2 extends Character{
    constructor(x,y){
        super(Math.floor(Math.random() * 1280), 500)
        this.width = 128;
        this.height = 82;
        this.image = new Image();
        this.staggerFrame = 5;
        this.image.src = "bird.png"
        this.frame = 0;
        this.originX = 0;
        this.originY = 0;
        this.destinationX = 0;
        this.destinationY = 0;
        this.originTimer = 0;
        this.timer = 0;
        this.score = 20;
    }

    draw(){
        if(this.frame == 7){
            this.frame = 0;
        }

        if(frame % this.staggerFrame == 0){
            this.frame++;
        }
        
        ctx.drawImage(this.image, 
            this.frame * this.width, 0,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height);
    }

    update() {
        if(this.timer == 0){
            this.originTimer = Math.floor(Math.random() * 500) + 300;
            this.timer = this.originTimer;
            this.originX = this.x;
            this.originY = this.y;
            this.destinationX = Math.floor(Math.random() * 1280);
            this.destinationY = Math.floor(Math.random() * 500);
        }

        if(Math.hypot(this.destinationX - this.x, this.destinationY - this.y) < 10){
            this.x = this.destinationX;
            this.y = this.destinationY;
        }

        this.x = lerp(this.originX, this.destinationX, 1 - this.timer/this.originTimer);
        this.y = lerp(this.originY, this.destinationY, 1 - this.timer/this.originTimer);

        this.timer--;
    }
};


//Spawn Player
let p = new Player(0, 0);
characters.push(p);

//Spawn Enemy
function spawnEnemies()
{
    for(let i = 0; i < startRaven; i++)
    {
        characters.push(new Enemy(10, 0));
    }
    for(let j = 0; j < startBird; j++)
    {
        characters.push(new Enemy2(10, 0));
    }
}


spawnEnemies();

//Start Game Timer
startTimer();

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);

    for (const c of characters){
        c.update();
        c.draw();
    }
    
    frame++;
    
    handleGameStatus();
    requestAnimationFrame(animate);
    
}

animate();

function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

//Collision Detection
function collision(first, second){
    if (!(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y)) {
        return true;
        };
};


//Mouse Click Detect
canvas.addEventListener('click', function() {
    if(!gameSuccess && !gameFailed)
    {
        if(!p.shoot)
        {
            p.shoot = true;
            gunShot.play();
            for (let i=0; i < characters.length; i++)
            {
                if (collision(mouse, characters[i]) && i != 0 )
                {
                    hitMark.play();
                    currentScore += characters[i].score;
    
                    characters.splice(i,1);
                    if(currentScore >= winningScore)
                    {
                        gameSuccess = true;
                    }
                }
            }       
        }

    }
    
});

//Games Stats
function handleGameStatus() 
{
    //Score
    ctx.fillStyle = 'gold';
    ctx.font = '80px FredokaOne-Regular';
    ctx.fillText(currentScore, 40, 100);

    //Timer
    ctx.strokeStyle = 'crimson';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(0, 710);
    ctx.lineTo((timerSeconds / endTimer) * 1280, 710);
    ctx.stroke();

    if(gameSuccess && !gameFailed)
    {
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText('Level Complete', 130, 300);
        ctx.fillText('Time LEFT: ' + timerSeconds, 130, 450);
        ctx.fillText('Press Any Key to Replay', 130, 550);
    }
    if(gameFailed)
    {
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText('Time Over', 130, 300);
        ctx.fillText('Total Score: ' + currentScore, 130, 450);
        ctx.fillText('Press Any Key to Replay', 130, 550);
    }
}

//Start Game Timer
function startTimer() 
{
    timerSeconds = endTimer;
    intervalTimer = setInterval(function () {
        if(!gameFailed)
        {
            timerSeconds--;
        }
        
        if(timerSeconds <= 0)
        {
            gameFailed = true;
        }

        //Reset Timer
        if(gameFailed || gameSuccess)
        {
            clearInterval(intervalTimer);
        }
    }, 1000);
}

//Reset Game
window.addEventListener("keydown",function(e) 
{
    if(gameFailed || gameSuccess)
    {
        restartGame();
    }
});

function restartGame()
{
    currentScore = 0;
    totalEnemy = startTotalEnemy;
    gameFailed = false;
    gameSuccess = false;
    timerSeconds = 0;
    endTimer = startEndTimer;
    characters.splice(1);
    startTimer();
    spawnEnemies();
}

window.addEventListener('resize', function() {
    canvasPosition = canvas.getBoundingClientRect();
});