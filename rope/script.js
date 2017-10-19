var canvas = document.getElementById('rope');
var ctx = canvas.getContext('2d');

var W = $(window).width();
var H = $(window).height();
canvas.width = W;
canvas.height = H;

var rope = {},
    gravity = 0,
    bounceFactor = 0.7;
rope = {
lineWidth: 5,
startX: $('#box1').position().left + ($('#box1').width()/2),
startY: $('#box1').position().top + $('#box1').height(),
endX: $('#box2').position().left,
endY: $('#box2').position().top + ($('#box2').height()/2),
angleX: $('#box1').position().left + ($('#box1').width()/2),
angleY: ($('#box2').position().top + ($('#box2').height()/2)) - 0,
color: 'white',
vx: 0,
vy: 1,
init: function(){
    this.startX = $('#box1').position().left + ($('#box1').width()/2);
    this.startY = $('#box1').position().top + $('#box1').height();
    this.endX = $('#box2').position().left;
    this.endY = $('#box2').position().top + ($('#box2').height()/2);
    this.angleX = $('#box1').position().left + ($('#box1').width()/2);
    this.angleY = ($('#box2').position().top + ($('#box2').height()/2)) - 0;
  },
draw: function() {    
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.quadraticCurveTo(this.angleX,this.angleY,this.endX,this.endY);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
}
};

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}

//var bounces = 10;
//var curBounce = 0;
function update() {
    clearCanvas();
    rope.endX = $('#box2').position().left;
    rope.endY = $('#box2').position().top + ($('#box2').height()/2);
    
    rope.draw();
  
    rope.angleY += rope.vy;
    rope.vy += gravity;
    if(rope.angleY > $('#box2').position().top + ($('#box2').height()/2)) {
        rope.angleY = $('#box2').position().top + ($('#box2').height()/2);
		rope.vy *= -bounceFactor;
//        curBounce++;
//        if(curBounce>=bounces){
////            clearInterval(intV);
//            curBounce = 0;
//        }
    }
}

var intV;
function loop(){
  intV = setInterval(update, 1000/60);
}
loop();

$(window).resize(function(){
  clearInterval(intV);
  clearCanvas();
  rope.init();
  rope.draw();
  loop();
});