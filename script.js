const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

let frame = 0;

const levels = [
    [10, 5, 40],
    [1, 1, 5]
];

let bush = new Image();
bush.src = "bush.png"

//Current Game Variable
let level = 0;

let currentScore = 0;
let totalEnemy = levels[level][0] + levels[level][1];

let timerSeconds = 0;
let endTimer = levels[level][2];

let gameFailed = false;
let gameSuccess = false;

//Audio
let gunShot = new Audio('gunShot.mp3')
let hitMark = new Audio('hitMark.mp3')

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvas.getBoundingClientRect().left;
    mouse.y = e.y - canvas.getBoundingClientRect().top;
});

canvas.addEventListener('mouseleave', function(e) {
    mouse.x = undefined;
    mouse.y = undefined;
});

canvas.addEventListener('click', function() {
    if(!gameSuccess && !gameFailed)
    {
        if(!p.shoot)
        {
            p.shoot = true;
            gunShot.play();
            
            for (let i=0; i < characters.length; i++)
            {
                if (collision(mouse, characters[i]) && characters[i].width != 320)
                {
                    hitMark.play();
                    currentScore += characters[i].score;
    
                    characters.splice(i,1);
                    if(currentScore >= (levels[level][0]*10) + (levels[level][1]*20))
                    {
                        gameSuccess = true;
                    }
                }
            }       
        }
    }
});

window.addEventListener("keydown",function(e) 
{
    if(gameFailed || gameSuccess)
    {
        restartGame();
    }
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
        this.flip = 0;
        this.width = 0;
        this.height = 0;
        this.image = new Image();
        this.staggerFrame = 0;
        this.image.src = ""
        this.frame = 0;
        this.originX = 0;
        this.originY = 0;
        this.destinationX = 0;
        this.destinationY = 0;
        this.originTimer = 0;
        this.timer = 0;
        this.score = 0;
        this.difficulty = 0;
    }

    draw(){
        if(this.frame == 5){
            this.frame = 0;
        }

        if(frame % this.staggerFrame == 0){
            this.frame++;
        }
        
        if(this.destinationX - this.originX < 0)
            this.flip = 1;
        else
            this.flip = 0;

        ctx.drawImage(this.image, 
            this.frame * this.width, this.flip * 128,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height);
    }

    update() {
        if(this.timer == 0){
            this.originTimer = Math.floor(Math.random() * ((7 - this.difficulty) * 100)) + ((7 - this.difficulty) * 75);
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

class Pigeon extends Enemy{
    constructor(){
        super(Math.floor(Math.random() * 1280), 500)
        this.width = 128;
        this.height = 128;
        this.image = new Image();
        this.staggerFrame = 15;
        this.image.src = "pigeon.png"
        this.frame = 0;
        this.originX = 0;
        this.originY = 0;
        this.destinationX = 0;
        this.destinationY = 0;
        this.originTimer = 0;
        this.timer = 0;
        this.score = 10;
        this.difficulty = 3;
    }
};

class Raven extends Enemy{
    constructor(){
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
        this.score = 20;
        this.difficulty = 5;
    }
};

//Spawn Enemy
function spawnEnemies()
{
    for(let i = 0; i < levels[level][0]; i++)
    {
        characters.push(new Pigeon());
    }
    for(let j = 0; j < levels[level][1]; j++)
    {
        characters.push(new Raven());
    }
}

spawnEnemies();

//Spawn Player
let p = new Player(0, 0);
characters.push(p);

//Start Game Timer
startTimer();

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

function restartGame()
{
    currentScore = 0;
    totalEnemy = levels[level][0] + levels[level][1];
    gameFailed = false;
    gameSuccess = false;
    timerSeconds = 0;
    endTimer = levels[level][2];
    characters.splice(1);
    startTimer();
    spawnEnemies();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const c of characters){
        c.update();
        ctx.drawImage(bush, 0, 0);
        c.draw();
    }
    
    frame++;
    
    handleGameStatus();
    requestAnimationFrame(animate);
}

animate();