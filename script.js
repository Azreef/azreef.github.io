//Canvas
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
//Sprite
const playerImage = new Image();
playerImage.src = 'dragonAttackFramesReversePNG.png';
const spriteWidth = 237;
const spriteHeight = 180;
//Frame
let gameFrame = 0;
const staggerFrames = 5;
let frameX = 0;

function animate() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if(gameFrame % staggerFrames === 0){
        if(frameX < 4){
            frameX++;
        }
        else{
            frameX = 0;
        }
    }

    context.drawImage(playerImage, frameX * spriteWidth, 4 * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    gameFrame++;
    requestAnimationFrame(animate);
};

animate();