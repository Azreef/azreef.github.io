const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 900;

//mouse
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

class Player {
    constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.health = 100;
    }
    draw(){

    }
    update() {

    }
};

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    handleDefenders();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function collision(first, second){
    if (!(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y)) {
        return true;
        };
    };

    window.addEventListener('resize', function() {
    canvasPosition = canvas.getBoundingClientRect();
});