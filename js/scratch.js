'use strict';

var isDrawing,
		lastPoint,
		scratchResult;
var scratchContainer	= document.getElementById('scratchContainer'),
		canvas						= document.getElementById('canvasEl');

setCanvasSize(scratchContainer, 0.5);
function setCanvasSize(target, width) {
	let limit = 500;
	let value = document.querySelector('body').clientWidth * width;
	if (value > limit) {
		value = limit;
	}
	target.style.width = value + 'px';
	target.style.height = value + 'px';

	canvas.setAttribute("width", value);
	canvas.setAttribute("height", value);
}

var canvasWidth		= canvas.width,
		canvasHeight	= canvas.height,
		ctx						= canvas.getContext('2d'),
		image					= new Image(),
		brush					= new Image();

image.src = './images/scratch/img_cover.jpg';
image.onload = function () {
	ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
	document.querySelector('.inner_content').classList.add('visible');
};
brush.src = './images/scratch/img_brush.png';

canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('touchstart', handleMouseDown, false);
canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('touchmove', handleMouseMove, false);
canvas.addEventListener('mouseup', handleMouseUp, false);
canvas.addEventListener('touchend', handleMouseUp, false);

function distanceBetween(point1, point2) {
	return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
	return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

// Only test every `stride` pixel. `stride`x faster,
// but might lead to inaccuracy
function getFilledInPixels(stride) {
	if (!stride || stride < 1) { stride = 1; }

	var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
		pdata = pixels.data,
		l = pdata.length,
		total = (l / stride),
		count = 0;

	// Iterate over all pixels
	for (var i = count = 0; i < l; i += stride) {
		if (parseInt(pdata[i]) === 0) {
			count++;
		}
	}

	return Math.round((count / total) * 100);
}

function getMouse(e, canvas) {
	var offsetX = 0, offsetY = 0, mx, my;

	if (canvas.offsetParent !== undefined) {
		do {
			offsetX += canvas.offsetLeft;
			offsetY += canvas.offsetTop;
		} while ((canvas = canvas.offsetParent));
	}

	mx = (e.pageX || e.touches[0].clientX) - offsetX;
	my = (e.pageY || e.touches[0].clientY) - offsetY;

	return { x: mx, y: my };
}

function handlePercentage(filledInPixels) {
	filledInPixels = filledInPixels || 0;
	console.log(filledInPixels + '%');
	if (filledInPixels > 60) {
		canvas.classList.add('hidden');
		scratchResult = true;
		isDrawing = false;
		console.log('꽝임');
	}
}

function handleMouseDown(e) {
	if(scratchResult){return}
	isDrawing = true;
	lastPoint = getMouse(e, canvas);
}

function handleMouseMove(e) {
	if(!isDrawing) {return}
	e.preventDefault();

	console.log('move');

	var currentPoint = getMouse(e, canvas),
			dist = distanceBetween(lastPoint, currentPoint),
			angle = angleBetween(lastPoint, currentPoint),
			x, y;

	for (var i = 0; i < dist; i++) {
		x = lastPoint.x + (Math.sin(angle) * i) - 25;
		y = lastPoint.y + (Math.cos(angle) * i) - 25;
		ctx.globalCompositeOperation = 'destination-out';
		ctx.drawImage(brush, x, y);
	}

	lastPoint = currentPoint;
	handlePercentage(getFilledInPixels(32));
}

function handleMouseUp(e) {
	isDrawing = false;
}

window.addEventListener('resize', function(){
	setCanvasSize(scratchContainer, 0.5);
	ctx.drawImage(image, 0, 0, scratchContainer.clientWidth, scratchContainer.clientWidth);
});