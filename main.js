var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
const player = {
	spawnPoint: [4,7,400],
	x: 215,
	y: 367.5,
	xv: 0,
	yv: 0,
	g: 400,
	canJump: false,
	godMode: false,
	selectedBlock: [1,0],
};
const control = {
	up: false,
	down: false,
	left: false,
	right: false,
};
const level = [
	[1,1,1,1,1,1,1,1,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,0,1,0,1,1],
	[1,0,0,1,0,0,0,0,2],
	[1,0,0,0,2,0,1,3,1],
	[1,0,0,0,2,0,0,0,1],
	[0,0,5,0,1,0,0,0,1],
	[1,0,0,0,2,0,1,1,1],
	[1,2,0,1,1,0,0,8,0],
	[1,1,1,1,1,1,1,1,1],
];
const hasHitbox = [1,5];
const blockName = ["Empty Space","Solid Block","Death Block","Deactivated Check Point","Activated Check Point (Unavailable)","Bounce Block","Warp Block (Unavailable)","Gravity Up Block","Gravity Down Block"];

id("levelLayer").addEventListener("mousedown", function(input){
	if (input.ctrlKey) {
		player.x = input.offsetX;
		player.y = input.offsetY;
	} else {
		let xb = Math.floor(input.offsetX/blockSize);
		let yb = Math.floor(input.offsetY/blockSize);
		if (input.button == 0) level[xb][yb] = player.selectedBlock[0];
		if (input.button == 2) level[xb][yb] = player.selectedBlock[1];
		drawLevel();
	}
});
document.addEventListener("contextmenu", function(input){input.preventDefault();});

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = true;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = true;
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = true;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = true;
			break;
		case "KeyG":
			player.godMode = !player.godMode;
			drawPlayer();
			break;
		case "Comma":
			player.selectedBlock[input.shiftKey?1:0]--;
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = player.selectedBlock[input.shiftKey?1:0]+": "+blockName[player.selectedBlock[input.shiftKey?1:0]];
			break;
		case "Period":
			player.selectedBlock[input.shiftKey?1:0]++;
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = player.selectedBlock[input.shiftKey?1:0]+": "+blockName[player.selectedBlock[input.shiftKey?1:0]];
			break;
		case "KeyI":
			if (id("info").style.display != "none") {
				id("info").style.display = "none";
			} else if (id("info").style.display != "inline") id("info").style.display = "inline";
			break;
		case "KeyC":
			if (id("control").style.display != "none") {
				id("control").style.display = "none";
			} else if (id("control").style.display != "inline") id("info").style.display = "inline";
			break;
	}
});
document.addEventListener("keyup", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = false;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = false;
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = false;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = false;
			break;
	}
});

var id = x => document.getElementById(x);
function getBlockType(x,y) {
	if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
		return 1;
	}
	return level[x][y];
}
function isTouching(dir, type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	switch (dir) {
		case "left":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize < blockSize-(y1+blockSize)%blockSize) 
			|| (hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize < y2%blockSize);
			break;
		case "right":
			return (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize < blockSize-(y1+blockSize)%blockSize) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize < y2%blockSize);
			break;
		case "up":
			return ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b,y1b+1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b,y1b+1))))
			&& player.yv < 0;
			break;
		case "down":
			return ((hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x1b,y2b-1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x2b,y2b-1))))
			&& player.yv > 0;
			break;
		case "any":
			x1 = player.x + 1;
			x2 = player.x+playerSize - 1;
			y1 = player.y + 1;
			y2 = player.y+playerSize - 1;
			x1b = Math.floor(x1/blockSize);
			x2b = Math.floor(x2/blockSize);
			y1b = Math.floor(y1/blockSize);
			y2b = Math.floor(y2/blockSize);
			return getBlockType(x1b,y1b) == type
			|| getBlockType(x2b,y1b) == type
			|| getBlockType(x1b,y2b) == type
			|| getBlockType(x2b,y2b) == type;
	}
}

var lastFrame = 0;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	if (dt < 100) {
		let xprev = player.x;
		let yprev = player.y;
		// position change based on velocity
		player.x += player.xv * dt / 500 * gameSpeed;
		player.y += player.yv * dt / 500 * gameSpeed;
		// velocity change
		player.xv *= 0.5;
		if (Math.abs(player.xv) < 5) player.xv = 0;
		player.yv += player.g * dt / 500 * gameSpeed;
		if (Math.abs(player.yv) > Math.abs(player.g)) player.yv = player.g;
		// collision detection
		let x1 = player.x;
		let x2 = player.x+playerSize;
		let y1 = player.y;
		let y2 = player.y+playerSize;
		let x1b = Math.floor(x1/blockSize);
		let x2b = Math.floor(x2/blockSize);
		let y1b = Math.floor(y1/blockSize);
		let y2b = Math.floor(y2/blockSize);
		// left wall
		if (isTouching("left")) {
			player.xv = 0;
			player.x = (x1b + 1) * blockSize;
		}
		// right wall
		if (isTouching("right")) {
			player.xv = 0;
			player.x = x2b * blockSize - playerSize;
		}
		// ceiling
		if (isTouching("up")) {
			player.yv = 0;
			if (((getBlockType(x2b,y1b) == 5 && getBlockType(x1b,y1b) == 5)
			   || ((getBlockType(x2b,y1b) == 5 || getBlockType(x1b,y1b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y1b)) || hasHitbox.includes(getBlockType(x2b,y1b+1)))
				   || (!hasHitbox.includes(getBlockType(x1b,y1b)) || hasHitbox.includes(getBlockType(x1b,y1b+1))))))
			   && player.g < 0) player.yv = -player.g*3/4;
			player.y = (y1b + 1) * blockSize;
			if (player.g < 0 && player.yv <= 0) player.canJump = true;
		} else if (player.g < 0 && !player.godMode) player.canJump = false;
		// floor
		if (isTouching("down")) {
			player.yv = 0;
			if (((getBlockType(x2b,y2b) == 5 && getBlockType(x1b,y2b) == 5)
			   || ((getBlockType(x2b,y2b) == 5 || getBlockType(x1b,y2b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y2b)) || hasHitbox.includes(getBlockType(x2b,y2b-1))) 
				   || (!hasHitbox.includes(getBlockType(x1b,y2b)) || hasHitbox.includes(getBlockType(x1b,y2b-1))))))
			   && player.g > 0) player.yv = -player.g*3/4;
			player.y = y2b * blockSize - playerSize;
			if (player.g > 0 && player.yv >= 0) player.canJump = true;
		} else if (player.g > 0 && !player.godMode) player.canJump = false;
		x1 = player.x + 1;
		x2 = player.x+playerSize - 1;
		y1 = player.y + 1;
		y2 = player.y+playerSize - 1;
		x1b = Math.floor(x1/blockSize);
		x2b = Math.floor(x2/blockSize);
		y1b = Math.floor(y1/blockSize);
		y2b = Math.floor(y2/blockSize);
		// checkpoint
		if (isTouching("any",3)) {
			level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			if (getBlockType(x1b,y1b) == 3) {
				player.spawnPoint = [x1b,y1b,player.g];
				level[x1b][y1b] = 4;
			} else if (getBlockType(x2b,y1b) == 3) {
				player.spawnPoint = [x2b,y1b,player.g];
				level[x2b][y1b] = 4;
			} else if (getBlockType(x1b,y2b) == 3) {
				player.spawnPoint = [x1b,y2b,player.g];
				level[x1b][y2b] = 4;
			} else if (getBlockType(x2b,y2b) == 3) {
				player.spawnPoint = [x2b,y2b,player.g];
				level[x2b][y2b] = 4;
			}
			drawLevel();
		}
		// anti-grav
		if (isTouching("any",7)) {
			if (player.g > 0) player.g = -player.g;
		}
		if (isTouching("any",8)) {
			if (player.g < 0) player.g = -player.g;
		}
		// death block
		if (isTouching("any",2) && !player.godMode) {
			player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
			player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize)/2;
			player.xv = 0;
			player.yv = 0;
			player.g = player.spawnPoint[2];
		}
		// key input
		if (control.up && player.canJump) player.yv = -player.g/2;
		if (control.left) player.xv = -100;
		if (control.right) player.xv = 100;
		// draw checks
		if (player.x != xprev || player.y != yprev) drawPlayer();
	}
	window.requestAnimationFrame(nextFrame);
}
function drawPlayer() {
	let canvas = document.getElementById("playerLayer");
	let pL = canvas.getContext("2d");
	canvas.width = level.length*blockSize;
	canvas.height = level[0].length*blockSize;
	pL.clearRect(0,0,canvas.width,canvas.height);
	pL.fillStyle = "#0000FF";
	if (player.godMode) pL.fillStyle = "#FFFF00";
	pL.fillRect(Math.floor(player.x), Math.floor(player.y), playerSize, playerSize);
	adjustScreen();
}
function drawLevel() {
	let canvas = document.getElementById("levelLayer");
	let lL = canvas.getContext("2d");
	canvas.width = level.length*blockSize;
	canvas.height = level[0].length*blockSize;
	lL.clearRect(0,0,canvas.width,canvas.height);
	for (let x in level) {
		for (let y in level[x]) {
			lL.lineWidth = blockSize*3/25;
			let xb = x * blockSize;
			let yb = y * blockSize;
			let type = getBlockType(x,y);
			if (type != -1 && type != 0 && type != 6) {
				switch (type) {
					case 1:
						lL.fillStyle = "#000000";
						break;
					case 2:
						lL.fillStyle = "#FF0000";
						break;
					case 3:
						lL.fillStyle = "#00888888";
						break;
					case 4:
						lL.fillStyle = "#00FFFF88";
						break;
					case 5:
						lL.fillStyle = "#FFFF00";
						break;
					case 7:
						lL.fillStyle = "#FF888888";
						break;
					case 8:
						lL.fillStyle = "#8888FF88";
						break;
				}
				lL.fillRect(xb, yb, blockSize, blockSize);
				switch (type) {
					case 2:
						lL.strokeStyle = "#880000";
						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
						lL.stroke();

						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
						lL.stroke();
						break;
					case 3:
						lL.strokeStyle = "#00444488";
						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
						lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
						lL.stroke();
						break;
					case 4:
						lL.strokeStyle = "#00888888";
						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
						lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
						lL.stroke();
						break;
					case 5:
						lL.strokeStyle = "#888800";
						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize/4);
						lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
						lL.stroke();

						lL.beginPath();
						lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/4);
						lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
						lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/4);
						lL.stroke();
						break;
					case 7:
						lL.strokeStyle = "#88000088";
						lL.lineWidth = blockSize/25;
						lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize/25*3,blockSize/5,blockSize/5);

						for (let i=0; i<3; i++) {
							lL.beginPath();
							lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/25*3);
							lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/5+blockSize/25*6);
							lL.stroke();
						}
						break;
					case 8:
						lL.strokeStyle = "#00008888";
						lL.lineWidth = blockSize/25;
						lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);

						for (let i=0; i<3; i++) {
							lL.beginPath();
							lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/25*3);
							lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
							lL.stroke();
						}
						break;
				}
			}
		}
	}
	adjustScreen();
}
function adjustScreen() {
	let lvlx = Math.floor((window.innerWidth - level.length*blockSize) / 2);
	if (lvlx < 0) {
		lvlx = Math.floor(window.innerWidth/2) - Math.floor(player.x+playerSize/2);
		if (lvlx > 0) lvlx = 0;
		if (lvlx < window.innerWidth - level.length*blockSize) lvlx = Math.floor(level.length*blockSize - window.innerWidth);
	}
	let lvly = Math.floor((window.innerHeight - level[0].length*blockSize) / 2);
	if (lvly < 0) {
		lvly = Math.floor(window.innerHeight/2) - Math.floor(player.y+playerSize/2);
		if (lvly > 0) lvly = 0;
		if (lvly < window.innerHeight - level[0].length*blockSize) lvly = Math.floor(window.innerHeight - level[0].length*blockSize);
	}
	id("playerLayer").style.left = lvlx+"px";
	id("levelLayer").style.left = lvlx+"px";
	id("playerLayer").style.top = lvly+"px";
	id("levelLayer").style.top = lvly+"px";
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
drawPlayer();
drawLevel();
window.requestAnimationFrame(nextFrame);
