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
    [1, 1, 30],
    [5, 5, 40],
    [7, 5, 40],
    [10, 10, 50],
    [15, 15, 60],
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
let gunShot = new Audio('gunShot.mp3');
let hitMark = new Audio('hitMark.mp3');
let clickSound = new Audio('clickSound.mp3');

gunShot.volume = 0.3;

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
        ctx.drawImage(bush, 0, 0);

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

//Button check collision
function buttonCollision(first, secondx,secondy,secondw,secondh){
    if (!(first.x > secondx + secondw ||
    first.x + first.width < secondx ||
    first.y > secondy + secondh ||
    first.y + first.height < secondy)) {
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

    //Level
    ctx.fillText("Level: " + (level + 1), 500, 100);

    //Timer
    ctx.strokeStyle = 'crimson';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(0, 710);
    ctx.lineTo((timerSeconds / endTimer) * 1280, 710);
    ctx.stroke();

    //Button
    let continueBtn = new Image();
    let restartBtn = new Image();
    let replayBtn = new Image();

    continueBtn.src = "continue.png";
    restartBtn.src = "restart.png";
    replayBtn.src = "replay.png";


    if(gameSuccess && !gameFailed)
    {
        ctx.fillStyle = 'black';
        ctx.font = '80px FredokaOne-Regular';

        if(level <= 3)
        {
            ctx.fillText('Level Complete', 100, 300);
        }
        else if(level == 4)
        {
            ctx.fillText('All Level Complete', 10, 300);
        }
        

        //Continue
        let continueX = canvas.width/2 + 100;
        let continueY = 170;
        let continueW = 350;
        let continueH = 150;

        if(level <= 3)
        {
            ctx.drawImage(continueBtn,continueX,continueY,continueW,continueH);
        }
        else if(level == 4)
        {
            ctx.drawImage(replayBtn,continueX,continueY,continueW,continueH);
        }
        

        //Restart
        let resX = canvas.width/2 + 100;
        let resY = 350;
        let resW = 350;
        let resH = 150;

        ctx.drawImage(restartBtn,resX,resY,resW,resH);

        ctx.fillText('Time Left: ' + timerSeconds, 100, 450);
       
        canvas.addEventListener('click', function() {

            if(gameSuccess && !p.shoot)
            {
                if(buttonCollision(mouse,continueX,continueY,continueW,continueH))
                {
                    clickSound.play();
                    if(level <= 4)
                    {
                        level = level + 1;
                    }
                    else
                    {
                        level = 0   
                    }
                   
                    restartGame();
                }
                else if(buttonCollision(mouse,resX,resY,resW,resH))
                {
                    clickSound.play();
                    restartGame();
                }
            }
            
        });


    }

    if(gameFailed)
    {
        ctx.fillStyle = 'black';
        ctx.font = '80px FredokaOne-Regular';
        ctx.fillText('Time Over', 100, 300);
        ctx.fillText('Total Score: ' + currentScore, 100, 450);


        let resX = canvas.width/2 + 100;
        let resY = 350;
        let resW = 350;
        let resH = 150;

        ctx.drawImage(restartBtn,resX,resY,resW,resH);


        canvas.addEventListener('click', function() {
            
            if(gameFailed && !p.shoot)
            {
                if(buttonCollision(mouse,resX,resY,resW,resH))
                {
                    clickSound.play();
                    restartGame();
                }
            }
        });

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
    characters = [];
    spawnEnemies();
    characters.push(p);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const c of characters){
        c.update();
        c.draw();
    }
    
    handleGameStatus();
    
    frame++;
    
    requestAnimationFrame(animate);
}

animate();