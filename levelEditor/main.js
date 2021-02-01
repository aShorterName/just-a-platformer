var id = (x) => document.getElementById(x);
var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
const player = {
  startPoint: [4, 5, 325, 1, 600, false, false, false],
  spawnPoint: [4, 5, 325, 1, 600, false, false, false],
  x: 0,
  y: 0,
  xv: 0,
  yv: 0,
  g: 325,
  currentJumps: 0,
  canWalljump: false,
  wallJumpDir: "left",
  maxJumps: 1,
  moveSpeed: 600,
  jumpHeight: 205,
  switchOn: false,
  timerOn: false,
  jumpOn: false,
  godMode: false,
  noclip: false,
  selectedBlock: [1, 0],
  playerFocus: true
};
const control = {
  lmb: false,
  rmb: false,
  left: false,
  right: false,
  up: false,
  down: false,
  f: false
};
var level = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const hasHitbox = [1, 5, 11, 24, 25, 26, 33, 37, 40, 43, 47, 51];
const blockName = [
  "Empty Space",
  "Solid Block",
  "Death Block",
  "Check Point",
  "Activated Check Point",
  "Bounce Block", // basic (0,1,2,3,4,5)
  "G-Up Field",
  "G-Down Field",
  "G-Low Field",
  "G-Medium Field",
  "G-High Field", // grav (6,7,8,9,10)
  "Wall-Jump Block",
  "0-Jump Field",
  "1-Jump Field",
  "2-Jump Field",
  "3-Jump Field",
  "Inf-Jump Field", // jumping (11,12,13,14,15,16)
  "Start",
  "Goal",
  "Deactivated Start",
  "Activated Goal", // exclusive (17,18,19,20)
  "S-Slow Field",
  "S-Normal Field",
  "S-Fast Field", // speed (21,22,23)
  "Bounce Block++",
  "G-Bounce Up",
  "G-Bounce Down", // more bounce (24,25,26)
  "Force Field L",
  "Force Field R",
  "Force Field U",
  "Force Field D", // force (27,28,29,30)
  "Switch Block",
  "Toggle Block A",
  "Toggle Block B",
  "Toggle Death Block A",
  "Toggle Death Block B", // switchables (31,32,33,34,35)
  "Timer Block A",
  "Timer Block B",
  "Timer Death Block A",
  "Timer Death Block B", // timer (36,37,38,39)
  "Ice Block",
  "Portal", // other stuff (40,41)
  "Jump Block A",
  "Jump Block B",
  "Jump Death Block A",
  "Jump Death Block B", // jump-toggle (42,43,44,45)
  "Text Block",
  "Custom Bounce Block",
  "Custom G-Field",
  "Custom Jump Field",
  "Custom Speed Field",
  "Colored Solid Block",
  "Custom Toggle Block",
  "Custom Timer Block",
  "Custom Jump Block" // customizables (46,47,48,49,50,51,52)
];
const bannedBlock = [4, 19, 20];
const blockSelect = [
  "Special",
  17,
  3,
  18,
  41,
  46,
  "Basic",
  0,
  1,
  51,
  2,
  "Gravity",
  6,
  7,
  8,
  9,
  10,
  48,
  25,
  26,
  "Jumping",
  5,
  24,
  47,
  11,
  12,
  13,
  14,
  15,
  16,
  49,
  "Speed",
  21,
  22,
  23,
  40,
  50,
  "Force",
  27,
  28,
  29,
  30,
  "Switch",
  31,
  32,
  33,
  34,
  35,
  52,
  "Timer",
  36,
  37,
  38,
  39,
  53,
  "Jump-Toggle",
  42,
  43,
  44,
  45,
  54
];
const blockProperty = {
  41: ["TP Offset X", "TP Offset Y"],
  46: ["Text"],
  47: ["Power"],
  48: ["Gravity"],
  49: ["Jumps"],
  50: ["Speed"],
  51: ["ColorR", "ColorG", "ColorB"],
  52: ["BlockA", "BlockB", "Invert"],
  53: ["BlockA", "BlockB", "Invert"],
  54: ["BlockA", "BlockB", "Invert"]
};
const defaultProperty = {
  41: [0, 0],
  46: ["Text"],
  47: [275],
  48: [325],
  49: [1],
  50: [600],
  51: [127, 127, 255],
  52: [0, 1, false],
  53: [0, 1, false],
  54: [0, 1, false]
};
const propertyType = {
  41: ["number", "number"],
  46: ["any"],
  47: ["number"],
  48: ["number"],
  49: ["number"],
  50: ["number"],
  51: ["number", "number", "number"],
  52: ["block", "block", "boolean"],
  53: ["block", "block", "boolean"],
  54: ["block", "block", "boolean"]
};
const propertyLimit = {
  41: ["none", "none"],
  46: ["none"],
  47: [[0, 1000]],
  48: [[-2000, 2000]],
  49: [[0, Infinity]],
  50: [[0, 2000]],
  51: [
    [0, 255],
    [0, 255],
    [0, 255]
  ],
  52: [[0, blockName.length - 1], [0, blockName.length - 1], "none"],
  53: [[0, blockName.length - 1], [0, blockName.length - 1], "none"],
  54: [[0, blockName.length - 1], [0, blockName.length - 1], "none"]
};
var prevVersions = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
];
var currentVersion = 0;
var editProperty = false;

document.addEventListener("mousedown", function (input) {
  if (input.ctrlKey) {
    if (input.button === 0) control.lmb = true;
    if (input.button === 2) {
      player.playerFocus = true;
      adjustScreen();
    }
  }
});
id("levelLayer").addEventListener("mousedown", function (input) {
  if (!editProperty) {
    let xb = Math.floor(input.offsetX / blockSize);
    let yb = Math.floor(input.offsetY / blockSize);
    if (control.f) {
      if (input.button === 0) {
        openPropertyMenu(xb, yb);
      }
    } else if (input.ctrlKey) {
      if (input.button === 0) control.lmb = true;
      if (input.button === 2) {
        player.playerFocus = true;
        adjustScreen();
      }
    } else if (input.shiftKey) {
      if (input.button === 1) {
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "#0 0 0 5px FF0000";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
        }
        player.selectedBlock[1] = getBlockType(xb, yb, false);
        if (player.selectedBlock[1] === 4) player.selectedBlock[1] = 3;
        if (player.selectedBlock[1] === 19) player.selectedBlock[1] = 17;
        if (player.selectedBlock[1] === 20) player.selectedBlock[1] = 18;
        if (hasProperty(player.selectedBlock[1])) {
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            defaultProperty[player.selectedBlock[1]][i] =
              level[xb][yb][parseInt(i) + 1];
            if (propertyType[player.selectedBlock[1]][i] === "block") {
              if (defaultProperty[player.selectedBlock[1]][i] == 4) {
                defaultProperty[player.selectedBlock[1]][i] = 3;
                break;
              } else if (defaultProperty[player.selectedBlock[1]][i] == 17) {
                defaultProperty[player.selectedBlock[1]][i] = 19;
                break;
              } else if (defaultProperty[player.selectedBlock[1]][i] == 20) {
                defaultProperty[player.selectedBlock[1]][i] = 18;
                break;
              }
            }
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[1]),
            0,
            0,
            player.selectedBlock[1],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #0000FF";
        }
      } else {
        player.x = input.offsetX - playerSize / 2;
        player.y = input.offsetY - playerSize / 2;
        player.xv = 0;
        player.yv = 0;
        drawPlayer();
      }
    } else {
      if (
        input.button === 0 &&
        !bannedBlock.includes(player.selectedBlock[0])
      ) {
        control.lmb = true;
        if (player.selectedBlock[0] === 17) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i == 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
          player.startPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        drawLevel();
      } else if (input.button === 1) {
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #0000FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
        }
        player.selectedBlock[0] = getBlockType(xb, yb, false);
        if (player.selectedBlock[0] === 4) player.selectedBlock[0] = 3;
        if (player.selectedBlock[0] === 19) player.selectedBlock[0] = 17;
        if (player.selectedBlock[0] === 20) player.selectedBlock[0] = 18;
        if (hasProperty(player.selectedBlock[0])) {
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            defaultProperty[player.selectedBlock[0]][i] =
              level[xb][yb][parseInt(i) + 1];
            if (propertyType[player.selectedBlock[0]][i] === "block") {
              if (defaultProperty[player.selectedBlock[0]][i] == 4) {
                defaultProperty[player.selectedBlock[0]][i] = 3;
                break;
              } else if (defaultProperty[player.selectedBlock[0]][i] == 17) {
                defaultProperty[player.selectedBlock[0]][i] = 19;
                break;
              } else if (defaultProperty[player.selectedBlock[0]][i] == 20) {
                defaultProperty[player.selectedBlock[0]][i] = 18;
                break;
              }
            }
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[0]),
            0,
            0,
            player.selectedBlock[0],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF0000";
        }
      } else if (
        input.button === 2 &&
        !bannedBlock.includes(player.selectedBlock[1])
      ) {
        if (player.selectedBlock[1] === 17) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i == 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
          player.startPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[1])) {
          control.lmb = false;
          control.rmb = false;
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        control.rmb = true;
        drawLevel();
      }
    }
  }
});
id("levelLayer").addEventListener("mousemove", function (input) {
  if (!editProperty) {
    let xb = Math.floor(input.offsetX / blockSize);
    let yb = Math.floor(input.offsetY / blockSize);
    if (input.ctrlKey) {
      if (control.lmb) {
        player.playerFocus = false;
        lvlxOffset += input.movementX;
        lvlyOffset += input.movementY;
        adjustScreen();
      }
    } else if (!input.shiftKey) {
      if (control.lmb && !bannedBlock.includes(player.selectedBlock[0])) {
        if (player.selectedBlock[0] === 17) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i == 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
          player.startPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        drawLevel();
      } else if (
        control.rmb &&
        !bannedBlock.includes(player.selectedBlock[1])
      ) {
        if (player.selectedBlock[0] === 17) {
          let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
          if (spawnPoint == 4) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
          } else if (spawnPoint == 17) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
          } else if (spawnPoint == 20) {
            level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
          } else {
            for (let i in spawnPoint) {
              if (i == 0) continue;
              if (
                propertyType[
                  getBlockType(
                    player.spawnPoint[0],
                    player.spawnPoint[1],
                    false
                  )
                ][parseInt(i) - 1] === "block"
              ) {
                if (spawnPoint[i] == 4) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                  break;
                } else if (spawnPoint[i] == 17) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                  break;
                } else if (spawnPoint[i] == 20) {
                  level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                  break;
                }
              }
            }
          }
          player.startPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
          player.spawnPoint = [
            xb,
            yb,
            player.g,
            player.maxJumps,
            player.moveSpeed,
            player.switchOn,
            player.jumpOn,
            player.timerOn
          ];
        }
        if (hasProperty(player.selectedBlock[1])) {
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        drawLevel();
      }
    }
    id("mousePos").innerHTML = "[" + xb + "," + yb + "]";
    if (hasProperty(getBlockType(xb, yb, false))) {
      let text = "";
      for (let i in blockProperty[getBlockType(xb, yb, false)]) {
        text += blockProperty[getBlockType(xb, yb, false)][i];
        text += ": ";
        if (propertyType[getBlockType(xb, yb, false)][i] === "block") {
          text += blockName[level[xb][yb][parseInt(i) + 1]];
        } else text += level[xb][yb][parseInt(i) + 1];
        text += "<br>";
      }
      id("tooltip").innerHTML = text;
      id("tooltip").style.display = "block";
      id("tooltip").style.left = input.clientX + 5 + "px";
      id("tooltip").style.top =
        input.clientY - id("tooltip").clientHeight - 5 + "px";
    } else {
      id("tooltip").style.display = "none";
    }
  }
});
id("levelLayer").addEventListener("mouseup", function (input) {
  if (input.button === 0) {
    control.lmb = false;
  } else if (input.button === 2) {
    control.rmb = false;
  }
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
id("levelLayer").addEventListener("mouseleave", function () {
  id("tooltip").style.display = "none";
  control.lmb = false;
  control.rmb = false;
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
document.addEventListener("contextmenu", function (input) {
  input.preventDefault();
});

document.addEventListener("keydown", function (input) {
  if (!editProperty) {
    let key = input.code;
    switch (key) {
      case "ArrowUp":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          input.preventDefault();
          for (let i in level) {
            if (dw > 0) for (let j = 0; j < dw; j++) level[i].unshift(0);
            if (dw < 0) {
              for (let j = 0; j > dw; j--) {
                if (level[0].length > 1) level[i].shift();
              }
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          input.preventDefault();
          if (level[0].length > 1) {
            for (let i in level) level[i].shift();
          }
          player.spawnPoint[1]--;
          player.startPoint[1]--;
          player.y -= blockSize;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.shiftKey) {
          input.preventDefault();
          for (let i in level) {
            level[i].unshift(0);
          }
          player.spawnPoint[1]++;
          player.startPoint[1]++;
          player.y += blockSize;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        }
      case "KeyW":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey)) {
          control.up = true;
          if (player.canWalljump) {
            player.jumpOn = !player.jumpOn;
            drawLevel();
            if (player.wallJumpDir == "left") {
              player.xv = -600;
              player.yv = -Math.sign(player.g) * player.jumpHeight;
            }
            if (player.wallJumpDir == "right") {
              player.xv = 600;
              player.yv = -Math.sign(player.g) * player.jumpHeight;
            }
          } else if (player.currentJumps > 0 || player.godMode) {
            player.jumpOn = !player.jumpOn;
            drawLevel();
            player.yv = -Math.sign(player.g) * player.jumpHeight;
            player.currentJumps--;
          }
        }
        break;
      case "ArrowDown":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          input.preventDefault();
          for (let i in level) {
            if (dw > 0) for (let j = 0; j < dw; j++) level[i].push(0);
            if (dw < 0) {
              for (let j = 0; j > dw; j--) {
                if (level[0].length > 1) level[i].pop();
              }
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          input.preventDefault();
          if (level[0].length > 1) {
            for (let i in level) level[i].pop();
          }
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.shiftKey) {
          input.preventDefault();
          for (let i in level) {
            level[i].push(0);
          }
          id("lvlHeight").innerHTML = level[0].length;
          id("levelLayer").height = level[0].length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        }
      case "KeyS":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.down = true;
        break;
      case "ArrowLeft":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          input.preventDefault();
          if (dw > 0) {
            for (let j = 0; j < dw; j++) {
              level.unshift([]);
              level[0].length = level[1].length;
              level[0].fill(0);
            }
          }
          if (dw < 0) {
            for (let j = 0; j > dw; j--) {
              if (level.length > 1) level.shift();
            }
          }
          player.spawnPoint[1] += dw;
          player.startPoint[1] += dw;
          player.y += blockSize * dw;
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          input.preventDefault();
          if (level.length > 1) {
            level.shift();
            player.spawnPoint[0]--;
            player.startPoint[0]--;
            player.x -= blockSize;
            id("lvlWidth").innerHTML = level.length;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            drawLevel();
            addVersion();
          }
        } else if (input.shiftKey) {
          input.preventDefault();
          level.unshift([]);
          level[0].length = level[1].length;
          level[0].fill(0);
          player.spawnPoint[0]++;
          player.startPoint[0]++;
          player.x += blockSize;
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        }
      case "KeyA":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.left = true;
        break;
      case "ArrowRight":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else break;
          input.preventDefault();
          if (dw > 0) {
            for (let j = 0; j < dw; j++) {
              level.push([]);
              level[level.length - 1].length = level[0].length;
              level[level.length - 1].fill(0);
            }
          }
          if (dw < 0) {
            for (let j = 0; j > dw; j--) {
              if (level.length > 1) level.pop();
            }
          }
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        } else if (input.ctrlKey || input.metaKey) {
          input.preventDefault();
          if (level.length > 1) {
            level.pop();
            id("lvlWidth").innerHTML = level.length;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            drawLevel();
            addVersion();
          }
        } else if (input.shiftKey) {
          input.preventDefault();
          level.push([]);
          level[level.length - 1].length = level[0].length;
          level[level.length - 1].fill(0);
          id("lvlWidth").innerHTML = level.length;
          id("levelLayer").width = level.length * blockSize;
          prevLevel = [];
          drawLevel();
          addVersion();
        }
      case "KeyD":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.right = true;
        break;
      case "KeyF":
        control.f = true;
        break;
      case "KeyR":
        if (input.shiftKey) {
          toStart();
        } else respawn();
        break;
      case "KeyG":
        player.godMode = !player.godMode;
        drawPlayer();
        break;
      case "KeyN":
        player.noclip = !player.noclip;
        drawPlayer();
        break;
      case "KeyI":
        if (id("info").style.display !== "none") {
          id("info").style.display = "none";
        } else if (id("info").style.display !== "inline")
          id("info").style.display = "inline";
        break;
      case "KeyC":
        if (id("control").style.display !== "none") {
          id("control").style.display = "none";
        } else if (id("control").style.display !== "inline")
          id("control").style.display = "inline";
        break;
      case "KeyB":
        if (id("blockSelect").style.display !== "none") {
          id("blockSelect").style.display = "none";
        } else if (id("blockSelect").style.display !== "flex")
          id("blockSelect").style.display = "flex";
        break;
      case "KeyE":
        if (input.ctrlKey || input.metaKey) {
          control.lmb = false;
          control.rmb = false;
          let data = prompt("Please enter level data.");
          if (data) {
            data = JSON.parse(data);
            level = data;
            id("lvlWidth").innerHTML = level.length;
            id("lvlHeight").innerHTML = level[0].length;
            id("levelLayer").height = level[0].length * blockSize;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            toStart();
            drawLevel();
          }
        } else if (input.shiftKey) {
          control.lmb = false;
          control.rmb = false;
          let data = prompt("Please enter level data.");
          if (data) {
            data = JSON.parse(data);
            level = data[0];
            player.startPoint = data[1];
            if (!player.startPoint[3]) player.startPoint[3] = 1;
            if (player.startPoint[3] === "Infinity")
              player.startPoint[3] = Infinity;
            if (!player.startPoint[4]) player.startPoint[4] = 600;
            if (player.startPoint[4] === 100) player.startPoint[4] = 300;
            if (player.startPoint[4] === 200) player.startPoint[4] = 600;
            if (player.startPoint[4] === 400) player.startPoint[4] = 1200;
            if (player.startPoint[4] === 325) player.startPoint[4] = 300;
            if (player.startPoint[4] === 750) player.startPoint[4] = 600;
            if (player.startPoint[4] === 1500) player.startPoint[4] = 1200;
            if (!player.startPoint[5]) player.startPoint[5] = false;
            player.spawnPoint = deepCopy(player.startPoint);
            id("lvlWidth").innerHTML = level.length;
            id("lvlHeight").innerHTML = level[0].length;
            id("levelLayer").height = level[0].length * blockSize;
            id("levelLayer").width = level.length * blockSize;
            prevLevel = [];
            toStart();
            drawLevel();
          }
        } else {
          if (!editProperty) input.preventDefault();
          control.lmb = false;
          control.rmb = false;
          let adjustedLevel = deepCopy(level);
          for (let x in adjustedLevel) {
            for (let y in adjustedLevel[x]) {
              if (adjustedLevel[x][y] == 4) {
                adjustedLevel[x][y] = 3;
              } else if (adjustedLevel[x][y] == 19) {
                adjustedLevel[x][y] = 17;
              } else if (adjustedLevel[x][y] == 20) {
                adjustedLevel[x][y] = 18;
              } else if (hasProperty(adjustedLevel[x][y])) {
                for (let i in adjustedLevel[x][y]) {
                  if (i == 0) continue;
                  if (
                    propertyType[adjustedLevel[x][y][0]][parseInt(i) - 1] ===
                    "block"
                  ) {
                    if (adjustedLevel[x][y][i] == 4) {
                      adjustedLevel[x][y][i] = 3;
                      break;
                    } else if (adjustedLevel[x][y][i] == 19) {
                      adjustedLevel[x][y][i] = 17;
                      break;
                    } else if (adjustedLevel[x][y][i] == 20) {
                      adjustedLevel[x][y][i] = 18;
                      break;
                    }
                  }
                }
              }
            }
          }
          let startData = player.startPoint;
          if (startData[3] === Infinity) startData[3] = "Infinity";
          id("exportArea").value = JSON.stringify([adjustedLevel, startData]);
          id("exportArea").style.display = "inline";
          id("exportArea").focus();
          id("exportArea").select();
          document.execCommand("copy");
          id("exportArea").style.display = "none";
          alert("Level data copied to clipboard!");
        }
        break;
      case "Delete":
        if (input.shiftKey) {
          for (let i in level) level[i] = level[i].fill(0);
          drawLevel();
        }
        break;
      case "KeyZ":
        if (input.ctrlKey || input.metaKey) {
          if (input.shiftKey) {
            if (currentVersion < prevVersions.length - 1) {
              currentVersion++;
              level = deepCopy(prevVersions[currentVersion]);
              drawLevel();
            }
          } else if (currentVersion > 0) {
            currentVersion--;
            level = deepCopy(prevVersions[currentVersion]);
            drawLevel();
          }
        }
        break;
      default:
    }
  }
});
document.addEventListener("keyup", function (input) {
  if (!editProperty) {
    let key = input.code;
    switch (key) {
      case "ArrowLeft":
      case "KeyA":
        control.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        control.right = false;
        break;
      case "ArrowUp":
      case "KeyW":
        control.up = false;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = false;
        break;
      case "KeyF":
        control.f = false;
        break;
      default:
    }
  }
});

function addVersion() {
  currentVersion++;
  prevVersions.length = currentVersion;
  prevVersions.push(deepCopy(level));
}
function openPropertyMenu(x, y, type = getBlockType(x, y, false), editDefault) {
  control.f = false;
  if (hasProperty(type)) {
    let props = blockProperty[type];
    let menu = id("editProperty");
    menu.innerHTML = "";
    for (let i in props) {
      let sect = document.createElement("div");
      menu.appendChild(sect);
      let label = document.createElement("span");
      label.innerHTML = props[i] + ": ";
      sect.appendChild(label);
      let input;
      if (propertyType[type][i] === "block") {
        input = document.createElement("select");
        let currentSect;
        for (let i in blockSelect) {
          if (typeof blockSelect[i] === "string") {
            currentSect = document.createElement("optGroup");
            currentSect.label = blockSelect[i];
            input.appendChild(currentSect);
          } else if (!hasProperty(blockSelect[i])) {
            let option = document.createElement("option");
            option.innerHTML = blockName[blockSelect[i]];
            option.value = blockSelect[i];
            currentSect.appendChild(option);
          }
        }
      } else if (propertyType[type][i] === "boolean") {
        label.style.verticalAlign = "-0.25em";
        input = document.createElement("input");
        input.type = "checkbox";
      } else {
        label.style.verticalAlign = "1em";
        input = document.createElement("textarea");
        let text;
        if (propertyLimit[type][i] !== "none") {
          text = "From ";
          text += propertyLimit[type][i][0];
          text += " to ";
          text += propertyLimit[type][i][1];
        } else text = "No limits";
        addTooltip(input, text);
      }
      input.id = "prop" + props[i];
      if (editDefault) {
        input.value = defaultProperty[type][i];
      } else {
        input.value = level[x][y][parseInt(i) + 1];
      }
      sect.appendChild(input);
    }
    let confirm = document.createElement("button");
    confirm.innerHTML = "confirm";
    confirm.onclick = function () {
      let err = false;
      for (let i in props) {
        let newVal = id("prop" + props[i]).value;
        if (propertyType[type][i] == "boolean")
          newVal = id("prop" + props[i]).checked;
        if (newVal == parseFloat(newVal)) newVal = parseFloat(newVal);
        if (newVal == "Infinity") newVal = Infinity;
        if (
          (typeof newVal == propertyType[type][i] ||
            propertyType[type][i] == "any" ||
            (propertyType[type][i] == "block" && typeof newVal == "number")) &&
          ((newVal >= propertyLimit[type][i][0] &&
            newVal <= propertyLimit[type][i][1]) ||
            propertyLimit[type][i] == "none")
        ) {
          if (propertyType[type][i] == "block" && newVal == 17) {
            let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
            if (spawnPoint == 4) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
            } else if (spawnPoint == 17) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
            } else if (spawnPoint == 20) {
              level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
            } else {
              for (let i in spawnPoint) {
                if (i == 0) continue;
                if (
                  propertyType[
                    getBlockType(
                      player.spawnPoint[0],
                      player.spawnPoint[1],
                      false
                    )
                  ][parseInt(i) - 1] === "block"
                ) {
                  if (spawnPoint[i] == 4) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                    break;
                  } else if (spawnPoint[i] == 17) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                    break;
                  } else if (spawnPoint[i] == 20) {
                    level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                    break;
                  }
                }
              }
            }
            player.startPoint = [
              x,
              y,
              player.g,
              player.maxJumps,
              player.moveSpeed,
              player.switchOn,
              player.jumpOn,
              player.timerOn
            ];
            player.spawnPoint = [
              x,
              y,
              player.g,
              player.maxJumps,
              player.moveSpeed,
              player.switchOn,
              player.jumpOn,
              player.timerOn
            ];
          }
          if (editDefault) {
            defaultProperty[type][i] = newVal;
          } else {
            level[x][y][parseInt(i) + 1] = newVal;
          }
          drawLevel();
        } else {
          err = true;
          id("prop" + props[i]).value = "";
        }
      }
      if (!err) {
        menu.style.display = "none";
        if (!editDefault) {
          drawBlock(id("blockSelect" + type), 0, 0, type, 0, 0, 1, true);
          addVersion();
        }
        editProperty = false;
      } else {
        alert("Invalid value!");
      }
    };
    menu.appendChild(confirm);
    let cancel = document.createElement("button");
    cancel.innerHTML = "cancel";
    cancel.onclick = function () {
      menu.style.display = "none";
      editProperty = false;
    };
    menu.appendChild(cancel);
    menu.onkeydown = function (input) {
      if (input.code === "Enter" && !input.shiftKey) confirm.click();
    };
    menu.style.display = "block";
    editProperty = true;
  }
}
function addTooltip(elem, text) {
  elem.addEventListener("mousemove", function (event) {
    id("tooltip").innerHTML = text;
    id("tooltip").style.display = "block";
    id("tooltip").style.left = event.clientX + 5 + "px";
    id("tooltip").style.top =
      event.clientY - id("tooltip").clientHeight - 5 + "px";
  });
  elem.addEventListener("mouseleave", function () {
    id("tooltip").style.display = "none";
  });
}
function hasProperty(blockId) {
  return Object.keys(blockProperty).includes(String(blockId));
}
function deepCopy(inObject) {
  //definitely not copied from somewhere else
  let outObject, value, key;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }
  outObject = Array.isArray(inObject) ? [] : {};
  for (key in inObject) {
    value = inObject[key];
    outObject[key] = deepCopy(value);
  }
  return outObject;
}
function getBlockType(x, y, subtype = true) {
  if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
    return 1;
  }
  if (typeof level[x][y] === "object") {
    if (subtype) {
      if (level[x][y][0] === 52) {
        if (player.switchOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
      if (level[x][y][0] === 53) {
        if (player.timerOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
      if (level[x][y][0] === 54) {
        if (player.jumpOn !== level[x][y][3]) {
          return level[x][y][1];
        } else return level[x][y][2];
      }
    }
    return level[x][y][0];
  }
  return level[x][y];
}
function isTouching(dir, type) {
  if (player.noclip) return false;
  let x1 = player.x;
  let x2 = player.x + playerSize;
  let y1 = player.y;
  let y2 = player.y + playerSize;
  let x1b = Math.floor(x1 / blockSize);
  let x2b = Math.floor(x2 / blockSize);
  let y1b = Math.floor(y1 / blockSize);
  let y2b = Math.floor(y2 / blockSize);
  switch (dir) {
    case "left":
      if (type != undefined) {
        return (
          ((getBlockType(x1b, y1b) == type && getBlockType(x1b, y2b) == type) ||
            (getBlockType(x1b, y1b) == type &&
              blockSize - ((x1 + blockSize) % blockSize) <
                blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x1b + 1, y1b)) &&
              getBlockType(x1b + 1, y1b) != 2) ||
            (getBlockType(x1b, y2b) == type &&
              blockSize - ((x1 + blockSize) % blockSize) < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x1b + 1, y2b)) &&
              getBlockType(x1b + 1, y2b) != 2)) &&
          player.xv <= 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x1b, y1b)) &&
            hasHitbox.includes(getBlockType(x1b, y2b))) ||
            (hasHitbox.includes(getBlockType(x1b, y1b)) &&
              blockSize - ((x1 + blockSize) % blockSize) <
                blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x1b + 1, y1b)) &&
              getBlockType(x1b + 1, y1b) != 2) ||
            (hasHitbox.includes(getBlockType(x1b, y2b)) &&
              blockSize - ((x1 + blockSize) % blockSize) < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x1b + 1, y2b)) &&
              getBlockType(x1b + 1, y2b) != 2)) &&
          player.xv <= 0
        );
      break;
    case "right":
      if (type != undefined) {
        return (
          ((getBlockType(x2b, y1b) == type && getBlockType(x2b, y2b) == type) ||
            (getBlockType(x2b, y1b) == type &&
              x2 % blockSize < blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b - 1, y1b)) &&
              getBlockType(x2b - 1, y1b) != 2) ||
            (getBlockType(x2b, y2b) == type &&
              x2 % blockSize < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b - 1, y2b)) &&
              getBlockType(x2b - 1, y2b) != 2)) &&
          player.xv >= 0
        );
      } else
        return (
          ((hasHitbox.includes(getBlockType(x2b, y1b)) &&
            hasHitbox.includes(getBlockType(x2b, y2b))) ||
            (hasHitbox.includes(getBlockType(x2b, y1b)) &&
              x2 % blockSize < blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b - 1, y1b)) &&
              getBlockType(x2b - 1, y1b) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y2b)) &&
              x2 % blockSize < y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b - 1, y2b)) &&
              getBlockType(x2b - 1, y2b) != 2)) &&
          player.xv >= 0
        );
      break;
    case "up":
      if (type != undefined) {
        return (
          (getBlockType(x1b, y1b) == type && getBlockType(x2b, y1b) == type) ||
          (((getBlockType(x1b, y1b) == type &&
            blockSize - ((x1 + blockSize) % blockSize) >
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b, y1b + 1)) &&
            getBlockType(x1b, y1b + 1) != 2) ||
            (getBlockType(x2b, y1b) == type &&
              x2 % blockSize > blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b, y1b + 1)) &&
              getBlockType(x2b, y1b + 1) != 2)) &&
            player.yv <= 0)
        );
      } else
        return (
          (hasHitbox.includes(getBlockType(x1b, y1b)) &&
            hasHitbox.includes(getBlockType(x2b, y1b))) ||
          (((hasHitbox.includes(getBlockType(x1b, y1b)) &&
            blockSize - ((x1 + blockSize) % blockSize) >
              blockSize - ((y1 + blockSize) % blockSize) &&
            !hasHitbox.includes(getBlockType(x1b, y1b + 1)) &&
            getBlockType(x1b, y1b + 1) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y1b)) &&
              x2 % blockSize > blockSize - ((y1 + blockSize) % blockSize) &&
              !hasHitbox.includes(getBlockType(x2b, y1b + 1)) &&
              getBlockType(x2b, y1b + 1) != 2)) &&
            player.yv <= 0)
        );
      break;
    case "down":
      if (type != undefined) {
        return (
          (getBlockType(x1b, y2b) == type && getBlockType(x2b, y2b) == type) ||
          (((getBlockType(x1b, y2b) == type &&
            blockSize - ((x1 + blockSize) % blockSize) > y2 % blockSize &&
            !hasHitbox.includes(getBlockType(x1b, y2b - 1)) &&
            getBlockType(x1b, y2b - 1) != 2) ||
            (getBlockType(x2b, y2b) == type &&
              x2 % blockSize > y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b, y2b - 1)) &&
              getBlockType(x2b, y2b - 1) != 2)) &&
            player.yv >= 0)
        );
      } else
        return (
          (hasHitbox.includes(getBlockType(x1b, y2b)) &&
            hasHitbox.includes(getBlockType(x2b, y2b))) ||
          (((hasHitbox.includes(getBlockType(x1b, y2b)) &&
            blockSize - ((x1 + blockSize) % blockSize) > y2 % blockSize &&
            !hasHitbox.includes(getBlockType(x1b, y2b - 1)) &&
            getBlockType(x1b, y2b - 1) != 2) ||
            (hasHitbox.includes(getBlockType(x2b, y2b)) &&
              x2 % blockSize > y2 % blockSize &&
              !hasHitbox.includes(getBlockType(x2b, y2b - 1)) &&
              getBlockType(x2b, y2b - 1) != 2)) &&
            player.yv >= 0)
        );
      break;
    case "any":
      x1 = player.x + 0.000001;
      x2 = player.x + playerSize - 0.000001;
      y1 = player.y + 0.000001;
      y2 = player.y + playerSize - 0.000001;
      x1b = Math.floor(x1 / blockSize);
      x2b = Math.floor(x2 / blockSize);
      y1b = Math.floor(y1 / blockSize);
      y2b = Math.floor(y2 / blockSize);
      return (
        getBlockType(x1b, y1b) == type ||
        getBlockType(x2b, y1b) == type ||
        getBlockType(x1b, y2b) == type ||
        getBlockType(x2b, y2b) == type
      );
    default:
  }
}
function getCoord(type) {
  let x1 = player.x;
  let x2 = player.x + playerSize;
  let y1 = player.y;
  let y2 = player.y + playerSize;
  let x1b = Math.floor(x1 / blockSize);
  let x2b = Math.floor(x2 / blockSize);
  let y1b = Math.floor(y1 / blockSize);
  let y2b = Math.floor(y2 / blockSize);
  if (getBlockType(x1b, y1b) === type) {
    return [x1b, y1b];
  } else if (getBlockType(x2b, y1b) === type) {
    return [x2b, y1b];
  } else if (getBlockType(x1b, y2b) === type) {
    return [x1b, y2b];
  } else if (getBlockType(x2b, y2b) === type) {
    return [x2b, y2b];
  }
}
function toStart() {
  player.x = player.startPoint[0] * blockSize + (blockSize - playerSize) / 2;
  player.y = player.startPoint[1] * blockSize + (blockSize - playerSize) / 2;
  player.xv = 0;
  player.yv = 0;
  player.g = player.startPoint[2];
  player.maxJumps = player.startPoint[3];
  player.currentJumps = player.maxJumps - 1;
  player.moveSpeed = player.startPoint[4];
  let shouldDraw =
    player.switchOn !== player.startPoint[5] ||
    player.jumpOn !== player.startPoint[6] ||
    player.timerOn !== player.startPoint[7] ||
    timerStage !== 0;
  player.switchOn = player.startPoint[5];
  player.jumpOn = player.startPoint[6];
  player.timerOn = player.startPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  if (shouldDraw) drawLevel();
}
function respawn() {
  player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize) / 2;
  player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize) / 2;
  player.xv = 0;
  player.yv = 0;
  player.g = player.spawnPoint[2];
  player.maxJumps = player.spawnPoint[3];
  player.currentJumps = player.maxJumps - 1;
  player.moveSpeed = player.spawnPoint[4];
  let shouldDraw =
    player.switchOn !== player.spawnPoint[5] ||
    player.jumpOn !== player.spawnPoint[6] ||
    player.timerOn !== player.spawnPoint[7] ||
    timerStage !== 0;
  player.switchOn = player.spawnPoint[5];
  player.jumpOn = player.spawnPoint[6];
  player.timerOn = player.spawnPoint[7];
  timerStage = 0;
  sinceLastTimerStage = 0;
  if (shouldDraw) drawLevel();
}

var lastFrame = 0;
var haltThreshold = 100;
var simReruns = 100;
var canSwitch = true;
var sinceLastTimerStage = 0;
var timerStage = 0;
var noFriction = false;
var prevTextCoord;
var xprev;
var yprev;
function nextFrame(timeStamp) {
  // setup stuff
  let dt = timeStamp - lastFrame;
  dt *= gameSpeed;
  lastFrame = timeStamp;
  sinceLastTimerStage += dt;
  if (dt < haltThreshold * gameSpeed) {
    dt = dt / simReruns;
    xprev = player.x;
    yprev = player.y;
    let shouldDrawLevel = false;
    for (let i = 0; i < simReruns; i++) {
      let shouldDie = false;
      // velocity change
      if (!noFriction) player.xv *= Math.pow(0.5, dt / 12);
      if (Math.abs(player.xv) < 5) player.xv = 0;
      player.yv += (player.g * dt) / 500;
      if (player.yv > player.g && player.g > 0) player.yv = player.g;
      if (player.yv < player.g && player.g < 0) player.yv = player.g;
      if (player.noclip) {
        player.xv = 0;
        player.yv = 0;
      }
      // position change based on velocity
      player.x += (player.xv * dt) / 500;
      player.y += (player.yv * dt) / 500;
      // collision detection
      let x1 = player.x;
      let x2 = player.x + playerSize;
      let y1 = player.y;
      let y2 = player.y + playerSize;
      let x1b = Math.floor(x1 / blockSize);
      let x2b = Math.floor(x2 / blockSize);
      let y1b = Math.floor(y1 / blockSize);
      let y2b = Math.floor(y2 / blockSize);
      // left wall
      if (isTouching("left")) {
        if (isTouching("left", 11) && control.left) {
          if (player.yv > player.g / 10 && player.g > 0)
            player.yv = player.g / 10;
          if (player.yv < player.g / 10 && player.g < 0)
            player.yv = player.g / 10;
          player.canWalljump = true;
          player.wallJumpDir = "right";
        } else if (i == 0) player.canWalljump = false;
        player.xv = 0;
        player.x = (x1b + 1) * blockSize;
      } else if (isTouching("right")) {
        // right wall
        if (isTouching("right", 11) && control.right) {
          if (player.yv > player.g / 10 && player.g > 0)
            player.yv = player.g / 10;
          if (player.yv < player.g / 10 && player.g < 0)
            player.yv = player.g / 10;
          player.canWalljump = true;
          player.wallJumpDir = "left";
        } else if (i === 0) player.canWalljump = false;
        player.xv = 0;
        player.x = x2b * blockSize - playerSize;
      } else if (i === 0) player.canWalljump = false;
      // ceiling
      if (isTouching("up")) {
        player.yv = 0;
        if (
          ((getBlockType(x2b, y1b) === 5 && getBlockType(x1b, y1b) === 5) ||
            (isTouching("up", 5) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        )
          player.yv = -Math.sign(player.g) * 275;
        if (
          ((getBlockType(x2b, y1b) === 24 && getBlockType(x1b, y1b) === 24) ||
            (isTouching("up", 24) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        )
          player.yv = -Math.sign(player.g) * 700;
        if (
          ((getBlockType(x2b, y1b) === 47 && getBlockType(x1b, y1b) === 47) ||
            (isTouching("up", 47) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        ) {
          let coord = getCoord(47);
          player.yv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
        }
        if (
          ((getBlockType(x2b, y1b) === 26 && getBlockType(x1b, y1b) === 26) ||
            (isTouching("up", 26) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        ) {
          player.g = -player.g;
          player.yv = player.g / 2;
        }
        if (
          ((getBlockType(x2b, y1b) == 40 && getBlockType(x1b, y1b) == 40) ||
            (isTouching("up", 40) &&
              (!hasHitbox.includes(getBlockType(x2b, y1b)) ||
                hasHitbox.includes(getBlockType(x2b, y1b + 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y1b)) ||
                hasHitbox.includes(getBlockType(x1b, y1b + 1))))) &&
          player.g < 0
        ) {
          noFriction = true;
        } else if (i == 0) noFriction = false;
        player.y = (y1b + 1) * blockSize;
        if (player.g < 0 && player.yv <= 0)
          player.currentJumps = player.maxJumps;
      } else {
        if (player.g < 0 && player.currentJumps == player.maxJumps)
          player.currentJumps = player.maxJumps - 1;
        if (i == 0) noFriction = false;
      }
      // floor
      if (isTouching("down")) {
        player.yv = 0;
        if (
          ((getBlockType(x2b, y2b) == 5 && getBlockType(x1b, y2b) == 5) ||
            (isTouching("down", 5) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        )
          player.yv = -Math.sign(player.g) * 275;
        if (
          ((getBlockType(x2b, y2b) == 24 && getBlockType(x1b, y2b) == 24) ||
            (isTouching("down", 24) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        )
          player.yv = -Math.sign(player.g) * 700;
        if (
          ((getBlockType(x2b, y2b) == 47 && getBlockType(x1b, y2b) == 47) ||
            (isTouching("down", 47) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        ) {
          let coord = getCoord(47);
          player.yv = -Math.sign(player.g) * level[coord[0]][coord[1]][1];
        }
        if (
          ((getBlockType(x2b, y2b) == 25 && getBlockType(x1b, y2b) == 25) ||
            (isTouching("down", 25) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        ) {
          player.g = -player.g;
          player.yv = player.g / 2;
        }
        if (
          ((getBlockType(x2b, y2b) == 40 && getBlockType(x1b, y2b) == 40) ||
            (isTouching("down", 40) &&
              (!hasHitbox.includes(getBlockType(x2b, y2b)) ||
                hasHitbox.includes(getBlockType(x2b, y2b - 1)) ||
                !hasHitbox.includes(getBlockType(x1b, y2b)) ||
                hasHitbox.includes(getBlockType(x1b, y2b - 1))))) &&
          player.g > 0
        ) {
          noFriction = true;
        } else if (i == 0) noFriction = false;
        player.y = y2b * blockSize - playerSize;
        if (player.g > 0 && player.yv >= 0)
          player.currentJumps = player.maxJumps;
      } else {
        if (player.g > 0 && player.currentJumps == player.maxJumps)
          player.currentJumps = player.maxJumps - 1;
        if (i == 0) noFriction = false;
      }
      // anti-grav
      if (isTouching("any", 6)) {
        if (player.g > 0) player.g = -player.g;
      }
      if (isTouching("any", 7)) {
        if (player.g < 0) player.g = -player.g;
      }
      // grav magnitude
      if (isTouching("any", 8)) player.g = Math.sign(player.g) * 170;
      if (isTouching("any", 9)) player.g = Math.sign(player.g) * 325;
      if (isTouching("any", 10)) player.g = Math.sign(player.g) * 650;
      if (isTouching("any", 48)) {
        let coord = getCoord(48);
        player.g = level[coord[0]][coord[1]][1];
      }
      // multi-jump
      if (isTouching("any", 12)) {
        player.maxJumps = 0;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 13)) {
        player.maxJumps = 1;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 14)) {
        player.maxJumps = 2;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 15)) {
        player.maxJumps = 3;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 16)) {
        player.maxJumps = Infinity;
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      if (isTouching("any", 49)) {
        let coord = getCoord(49);
        player.maxJumps = level[coord[0]][coord[1]][1];
        if (
          player.currentJumps != player.maxJumps &&
          player.currentJumps != player.maxJumps - 1
        )
          player.currentJumps = player.maxJumps - 1;
      }
      // checkpoint
      if (isTouching("any", 3)) {
        let coord = getCoord(3);
        let type = getBlockType(coord[0], coord[1], false);
        let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
        if (spawnPoint == 4) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
        } else if (spawnPoint == 17) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
        } else if (spawnPoint == 20) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
        } else {
          for (let i in spawnPoint) {
            if (i == 0) continue;
            if (
              propertyType[
                getBlockType(player.spawnPoint[0], player.spawnPoint[1], false)
              ][parseInt(i) - 1] === "block"
            ) {
              if (spawnPoint[i] == 4) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                break;
              } else if (spawnPoint[i] == 17) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                break;
              } else if (spawnPoint[i] == 20) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                break;
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn
        ];
        if (type !== 3) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i == 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 3
            ) {
              level[coord[0]][coord[1]][i] = 4;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 4;
        shouldDrawLevel = true;
      }
      if (isTouching("any", 18)) {
        let coord = getCoord(18);
        let type = getBlockType(coord[0], coord[1], false);
        let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
        if (spawnPoint == 4) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
        } else if (spawnPoint == 17) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
        } else if (spawnPoint == 20) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
        } else {
          for (let i in spawnPoint) {
            if (i === 0) continue;
            if (
              propertyType[
                getBlockType(player.spawnPoint[0], player.spawnPoint[1], false)
              ][parseInt(i) - 1] === "block"
            ) {
              if (spawnPoint[i] == 4) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                break;
              } else if (spawnPoint[i] == 17) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                break;
              } else if (spawnPoint[i] == 20) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                break;
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn
        ];
        if (type !== 18) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i == 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 18
            ) {
              level[coord[0]][coord[1]][i] = 20;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 20;
        shouldDrawLevel = true;
      }
      if (isTouching("any", 19)) {
        let coord = getCoord(19);
        let type = getBlockType(coord[0], coord[1], false);
        let spawnPoint = level[player.spawnPoint[0]][player.spawnPoint[1]];
        if (spawnPoint == 4) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
        } else if (spawnPoint == 17) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
        } else if (spawnPoint == 20) {
          level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
        } else {
          for (let i in spawnPoint) {
            if (i === 0) continue;
            if (
              propertyType[
                getBlockType(player.spawnPoint[0], player.spawnPoint[1], false)
              ][parseInt(i) - 1] === "block"
            ) {
              if (spawnPoint[i] == 4) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 3;
                break;
              } else if (spawnPoint[i] == 17) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 19;
                break;
              } else if (spawnPoint[i] == 20) {
                level[player.spawnPoint[0]][player.spawnPoint[1]][i] = 18;
                break;
              }
            }
          }
        }
        player.spawnPoint = [
          coord[0],
          coord[1],
          player.g,
          player.maxJumps,
          player.moveSpeed,
          player.switchOn,
          player.jumpOn,
          player.timerOn
        ];
        if (type !== 19) {
          for (let i in level[coord[0]][coord[1]]) {
            if (i === 0) continue;
            if (
              propertyType[type][i - 1] === "block" &&
              level[coord[0]][coord[1]][i] === 19
            ) {
              level[coord[0]][coord[1]][i] = 17;
              break;
            }
          }
        } else level[coord[0]][coord[1]] = 17;
        shouldDrawLevel = true;
      }
      // speed change
      if (isTouching("any", 21)) player.moveSpeed = 300;
      if (isTouching("any", 22)) player.moveSpeed = 600;
      if (isTouching("any", 23)) player.moveSpeed = 1200;
      if (isTouching("any", 50)) {
        let coord = getCoord(50);
        player.moveSpeed = level[coord[0]][coord[1]][1];
      }
      // force field
      if (isTouching("any", 27) && player.xv > -100) player.xv = -100;
      if (isTouching("any", 28) && player.xv < 100) player.xv = 100;
      if (isTouching("any", 29) && player.yv > -100) player.yv = -100;
      if (isTouching("any", 30) && player.yv < 100) player.yv = 100;
      // switch
      if (isTouching("any", 31)) {
        if (canSwitch) {
          player.switchOn = !player.switchOn;
          shouldDrawLevel = true;
        }
        canSwitch = false;
      } else canSwitch = true;
      if (player.switchOn) {
        hasHitbox[6] = 32;
      } else hasHitbox[6] = 33;
      // timer
      if (sinceLastTimerStage > 1000) {
        timerStage++;
        sinceLastTimerStage = sinceLastTimerStage % 1000;
        shouldDrawLevel = true;
      }
      if (timerStage > 3) {
        player.timerOn = !player.timerOn;
        timerStage = 0;
      }
      if (player.timerOn) {
        hasHitbox[7] = 36;
      } else hasHitbox[7] = 37;
      // jump-toggle
      if (player.jumpOn) {
        hasHitbox[9] = 42;
      } else hasHitbox[9] = 43;
      // text block
      if (isTouching("any", 46)) {
        let coord = getCoord(46);
        if (!arraysEqual(prevTextCoord, coord)) {
          let text = level[coord[0]][coord[1]][1];
          id("textBlockText").innerHTML = text;
          id("textBlockText").style.display = "block";
          let x = coord[0] * blockSize + blockSize / 2 + lvlxOffset;
          if (x < id("textBlockText").clientWidth / 2)
            x = id("textBlockText").clientWidth / 2;
          if (x > window.innerWidth - id("textBlockText").clientWidth / 2)
            x = window.innerWidth - id("textBlockText").clientWidth / 2;
          let y = coord[1] * blockSize + blockSize / 2 + lvlyOffset;
          if (y < id("textBlockText").clientHeight / 2)
            y = id("textBlockText").clientHeight / 2;
          if (y > window.innerHeight - id("textBlockText").clientHeight / 2)
            y = window.innerHeight - id("textBlockText").clientHeight / 2;
          id("textBlockText").style.left = x + "px";
          id("textBlockText").style.top = y + "px";
          prevTextCoord = coord;
        }
      } else {
        id("textBlockText").style.display = "none";
        prevTextCoord = [];
      }
      // death block
      if (isTouching("any", 2)) shouldDie = true;
      if (isTouching("any", 34) && player.switchOn) shouldDie = true;
      if (isTouching("any", 35) && !player.switchOn) shouldDie = true;
      if (isTouching("any", 38) && player.timerOn) shouldDie = true;
      if (isTouching("any", 39) && !player.timerOn) shouldDie = true;
      if (isTouching("any", 44) && player.jumpOn) shouldDie = true;
      if (isTouching("any", 45) && !player.jumpOn) shouldDie = true;
      if (
        hasHitbox.includes(getBlockType(x1b, y1b)) &&
        hasHitbox.includes(getBlockType(x2b, y1b)) &&
        hasHitbox.includes(getBlockType(x1b, y2b)) &&
        hasHitbox.includes(getBlockType(x2b, y2b)) &&
        !player.noclip
      ) {
        let cx = x1 + playerSize / 2;
        let cy = y1 + playerSize / 2;
        let cxb = Math.floor(cx / blockSize);
        let cyb = Math.floor(cy / blockSize);
        let dx1 = cx % blockSize;
        let dx2 = blockSize - dx1;
        let dy1 = cy % blockSize;
        let dy2 = blockSize - dy1;
        let list = [dx1, dx2, dy1, dy2].sort();
        let maybeShouldDie = true;
        for (let i in list) {
          if (list[i] < blockSize / 2) {
            if (
              list[i] == dx1 &&
              !hasHitbox.includes(getBlockType(cxb - 1, cyb))
            ) {
              player.xv = 0;
              player.x = cxb * blockSize - playerSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dx2 &&
              !hasHitbox.includes(getBlockType(cxb + 1, cyb))
            ) {
              player.xv = 0;
              player.x = (cxb + 1) * blockSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dy1 &&
              !hasHitbox.includes(getBlockType(cxb, cyb - 1))
            ) {
              player.yv = 0;
              player.y = cyb * blockSize - playerSize;
              maybeShouldDie = false;
              break;
            } else if (
              list[i] == dy2 &&
              !hasHitbox.includes(getBlockType(cxb, cyb + 1))
            ) {
              player.yv = 0;
              player.y = (cyb + 1) * blockSize;
              maybeShouldDie = false;
              break;
            }
          }
        }
        if (maybeShouldDie) shouldDie = true;
      }
      if (!player.godMode && shouldDie) respawn();
      // portal
      if (isTouching("any", 41)) {
        let coord = getCoord(41);
        player.x =
          (coord[0] + level[coord[0]][coord[1]][1]) * blockSize +
          (blockSize - playerSize) / 2;
        player.y =
          (coord[1] + level[coord[0]][coord[1]][2]) * blockSize +
          (blockSize - playerSize) / 2;
      }
      // OoB check
      if (player.x < 0) player.x = 0;
      if (player.x > level.length * blockSize - playerSize)
        player.x = level.length * blockSize - playerSize;
      if (player.y < 0) player.y = 0;
      if (player.y > level[0].length * blockSize - playerSize)
        player.y = level[0].length * blockSize - playerSize;
    }
    // key input
    if (player.noclip) {
      if (control.left) player.x -= (simReruns * dt) / 4;
      if (control.right) player.x += (simReruns * dt) / 4;
      if (control.up) player.y -= (simReruns * dt) / 4;
      if (control.down) player.y += (simReruns * dt) / 4;
    } else {
      if (control.left && player.xv > -player.moveSpeed) {
        player.xv -= (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.xv < -player.moveSpeed / (noFriction ? 5 : 1))
          player.xv = -player.moveSpeed / (noFriction ? 5 : 1);
      }
      if (control.right && player.xv < player.moveSpeed) {
        player.xv += (player.moveSpeed * dt) / (noFriction ? 5 : 1);
        if (player.xv > player.moveSpeed / (noFriction ? 5 : 1))
          player.xv = player.moveSpeed / (noFriction ? 5 : 1);
      }
    }
    if (player.noclip) player.currentJumps = player.maxJumps;
    // draw checks
    if (shouldDrawLevel) drawLevel();
    if (player.x != xprev || player.y != yprev) adjustScreen();
  }
  window.requestAnimationFrame(nextFrame);
}
var lvlxOffset = 0;
var lvlyOffset = 0;
function drawPlayer() {
  let canvas = id("playerLayer");
  let pL = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  pL.clearRect(0, 0, canvas.width, canvas.height);
  let ratio = player.currentJumps / player.maxJumps;
  if (player.maxJumps === Infinity) ratio = 1;
  if (player.maxJumps === 0) ratio = 0;
  pL.fillStyle = `rgb(${255 - ratio * 255},0,${ratio * 255})`;
  if (player.godMode) pL.fillStyle = "#FF00FF";
  if (player.noclip) pL.fillStyle += "88";
  pL.fillRect(
    Math.floor(player.x) + lvlxOffset,
    Math.floor(player.y) + lvlyOffset,
    playerSize,
    playerSize
  );
}
var prevLevel = [];
var prevSwitch = false;
var prevTimer = 0;
var prevJumpState = false;
function drawLevel() {
  let canvas = id("levelLayer");
  id("background").style.width = level.length * blockSize + "px";
  id("background").style.height = level[0].length * blockSize + "px";
  for (let x in level) {
    for (let y in level[x]) {
      if (prevLevel[x] == undefined) {
        drawBlock(canvas, parseInt(x), parseInt(y));
      } else {
        let prevBlock = prevLevel[x][y];
        if (prevBlock == undefined) prevBlock = 0;
        if (
          level[x][y] != prevBlock ||
          (player.switchOn != prevSwitch &&
            [31, 32, 33, 34, 35].includes(level[x][y])) ||
          (timerStage != prevTimer && [36, 37, 38, 39].includes(level[x][y])) ||
          (player.jumpOn != prevJumpState &&
            [42, 43, 44, 45].includes(level[x][y]))
        )
          drawBlock(canvas, parseInt(x), parseInt(y));
      }
    }
  }
  adjustScreen();
  drawPlayer();
  prevLevel = deepCopy(level);
  prevSwitch = player.switchOn;
  prevTimer = timerStage;
  prevJumpState = player.jumpOn;
}
function drawBlock(
  canvas,
  x,
  y,
  type = getBlockType(x, y, false),
  xOffset = 0,
  yOffset = 0,
  size = 1,
  useDefault = false
) {
  blockSize *= size;
  let lL = canvas.getContext("2d");
  lL.lineWidth = (blockSize * 3) / 25;
  let xb = ((x + xOffset) / size) * blockSize;
  let yb = ((y + yOffset) / size) * blockSize;
  let clear = false;
  let data;
  if (hasProperty(type)) {
    data = level[x][y];
    if (useDefault) {
      data = defaultProperty[type].slice();
      data.unshift(0);
    }
  }
  let sOn = player.switchOn;
  let tOn = player.timerOn;
  let tSt = timerStage;
  let jOn = player.jumpOn;
  if (useDefault) {
    sOn = false;
    tOn = false;
    tSt = 0;
    jOn = false;
  }
  lL.clearRect(xb, yb, blockSize, blockSize);
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
    case 6:
      lL.fillStyle = "#FF888888";
      break;
    case 7:
      lL.fillStyle = "#8888FF88";
      break;
    case 8:
      lL.fillStyle = "#FFFF8888";
      break;
    case 9:
      lL.fillStyle = "#88FF8888";
      break;
    case 10:
      lL.fillStyle = "#88FFFF88";
      break;
    case 11:
      lL.fillStyle = "#7289DA";
      break;
    case 12:
      lL.fillStyle = "#77440088";
      break;
    case 13:
      lL.fillStyle = "#99550088";
      break;
    case 14:
      lL.fillStyle = "#BB660088";
      break;
    case 15:
      lL.fillStyle = "#DD770088";
      break;
    case 16:
      lL.fillStyle = "#FF880088";
      break;
    case 17:
      lL.fillStyle = "#FFFF0088";
      break;
    case 18:
      lL.fillStyle = "#88880088";
      break;
    case 19:
      lL.fillStyle = "#88880088";
      break;
    case 20:
      lL.fillStyle = "#FFFF0088";
      break;
    case 21:
      lL.fillStyle = "#00880088";
      break;
    case 22:
      lL.fillStyle = "#00BB0088";
      break;
    case 23:
      lL.fillStyle = "#00FF0088";
      break;
    case 24:
      lL.fillStyle = "#FF00FF";
      break;
    case 25:
      lL.fillStyle = "#FF8888";
      break;
    case 26:
      lL.fillStyle = "#88FFFF";
      break;
    case 27:
      lL.fillStyle = "#00000088";
      break;
    case 28:
      lL.fillStyle = "#00000088";
      break;
    case 29:
      lL.fillStyle = "#00000088";
      break;
    case 30:
      lL.fillStyle = "#00000088";
      break;
    case 31:
      if (!sOn) {
        lL.fillStyle = "#00880088";
      } else lL.fillStyle = "#00FF0088";
      break;
    case 32:
      if (!sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 33:
      if (sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 34:
      if (!sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 35:
      if (sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 36:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 37:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 38:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 39:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 40:
      lL.fillStyle = "#8888FF";
      break;
    case 41:
      lL.fillStyle = "#FF88FF88";
      break;
    case 42:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 43:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 44:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 45:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 46:
      lL.fillStyle = "#0000FF88";
      break;
    case 47:
      lL.fillStyle = `hsl(${(data[1] / 1000) * 360},100%,50%)`;
      break;
    case 48:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 49:
      lL.fillStyle = `hsla(${(data[1] * 360) / 10},100%,50%,0.5)`;
      break;
    case 50:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 51:
      lL.fillStyle = `rgb(${data[1]},${data[2]},${data[3]})`;
      break;
    default:
      clear = true;
  }
  if (!clear) lL.fillRect(xb, yb, blockSize, blockSize);
  switch (type) {
    case 2:
      lL.strokeStyle = "#880000";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 3:
      lL.strokeStyle = "#00444488";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 4:
      lL.strokeStyle = "#00888888";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 5:
      lL.strokeStyle = "#888800";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 6:
      lL.strokeStyle = "#88000088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 7:
      lL.strokeStyle = "#00008888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5 + (blockSize / 25) * 6);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 8:
      lL.strokeStyle = "#88880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 9
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 9:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 10:
      lL.strokeStyle = "#00888888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + (blockSize / 25) * 3
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 11:
      lL.strokeStyle = "#4E5D94";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize - blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();
      break;
    case 12:
      lL.strokeStyle = "#44220088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 13:
      lL.strokeStyle = "#55270088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 3) * 2, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 3) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 14:
      lL.strokeStyle = "#66330088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 3) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 3) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 6) * 5, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 6) * 5,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 15:
      lL.strokeStyle = "#77380088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 4) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 4) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 16:
      lL.strokeStyle = "#88440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize / 2,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize - blockSize / 2,
        yb + blockSize / 2
      );
      lL.stroke();
      break;
    case 17:
      lL.strokeStyle = "#88880088";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 18:
      lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 19:
      lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 20:
      lL.strokeStyle = "#88880088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 21:
      lL.strokeStyle = "#00440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 4 + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 4, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();
      break;
    case 22:
      lL.strokeStyle = "#00660088";
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 23:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 8) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 8) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 8) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 24:
      lL.strokeStyle = "#880088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 25:
      lL.strokeStyle = "#884444";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 26:
      lL.strokeStyle = "#448888";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 27:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 5, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 4,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 28:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 5, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 4, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 29:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 30:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 31:
      lL.lineWidth = blockSize / 25;
      if (!sOn) {
        lL.strokeStyle = "#00440088";
        lL.fillStyle = "#00440088";
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + (blockSize / 25) * 3 + (blockSize / 50) * 3,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      } else {
        lL.strokeStyle = "#00880088";
        lL.fillStyle = "#00880088";
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + blockSize / 2,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      }
      break;
    case 32:
      lL.strokeStyle = "#008800";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 33:
      lL.strokeStyle = "#004400";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 34:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;
      break;
    case 35:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#004400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 36:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (Math.PI / 2) * (tSt - 1)
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#66666688";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 37:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (Math.PI / 2) * (tSt - 1)
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#33333388";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 38:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (Math.PI / 2) * (tSt - 1)
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#66666688";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 39:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (Math.PI / 2) * (timerStage - 1)
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#33333388";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 40:
      lL.strokeStyle = "#444488";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.stroke();
      break;
    case 41:
      lL.strokeStyle = "#88448888";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 42:
      lL.strokeStyle = "#880000";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 43:
      lL.strokeStyle = "#442200";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 44:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#880000";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;
      break;
    case 45:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#442200";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 46:
      lL.strokeStyle = "#00008888";
      lL.fillStyle = "#00008888";
      lL.font = blockSize + "px serif";
      lL.textAlign = "center";
      lL.textBaseline = "middle";
      lL.fillText(
        "T",
        xb + blockSize / 2,
        yb + blockSize / 2 + (blockSize / 50) * 3
      );
      break;
    case 47:
      lL.strokeStyle = `hsl(${(data[1] / 1000) * 360},100%,25%)`;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 48:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 49:
      lL.strokeStyle = `hsla(${(data[1] * 360) / 10},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 50:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 52:
      if (sOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#00880044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 53:
      if (tOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#88888844";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.fillStyle = "#888888BB";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (Math.PI / 2) * (tSt - 1)
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#888888";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 54:
      if (jOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#88440044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#884400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    default:
  }
  blockSize /= size;
}
function adjustScreen() {
  if (player.playerFocus) {
    lvlxOffset = Math.floor((window.innerWidth - level.length * blockSize) / 2);
    lvlyOffset = Math.floor(
      (window.innerHeight - level.length[0] * blockSize) / 2
    );
    if (lvlxOffset < 0) {
      lvlxOffset =
        Math.floor(window.innerWidth / 2) -
        Math.floor(player.x + playerSize / 2);
      if (lvlxOffset > 0) lvlxOffset = 0;
      if (lvlxOffset < window.innerWidth - level.length * blockSize)
        lvlxOffset = Math.floor(window.innerWidth - level.length * blockSize);
    }
    lvlyOffset = Math.floor(
      (window.innerHeight - level[0].length * blockSize) / 2
    );
    if (lvlyOffset < 0) {
      lvlyOffset =
        Math.floor(window.innerHeight / 2) -
        Math.floor(player.y + playerSize / 2);
      if (lvlyOffset > 0) lvlyOffset = 0;
      if (lvlyOffset < window.innerHeight - level[0].length * blockSize)
        lvlyOffset = Math.floor(
          window.innerHeight - level[0].length * blockSize
        );
    }
  }
  id("levelLayer").style.left = lvlxOffset + "px";
  id("levelLayer").style.top = lvlyOffset + "px";
  id("background").style.left = lvlxOffset + "px";
  id("background").style.top = lvlyOffset + "px";
  drawPlayer();
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (typeof a[i] === "object" || typeof b[i] === "object") {
      if (!arraysEqual(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) return false;
  }
  return true;
}

function init() {
  toStart();
  id("levelLayer").height = level[0].length * blockSize;
  id("levelLayer").width = level.length * blockSize;
  drawLevel();
  let blockAmt = 0;
  let currentSect;
  for (let i in blockSelect) {
    if (typeof blockSelect[i] == "string") {
      currentSect = document.createElement("div");
      currentSect.style.height = "100%";
      currentSect.style.display = "flex";
      currentSect.style.flexFlow = "wrap";
      currentSect.style.marginRight = "5px";
      currentSect.style.background = "#00000022";
      id("blockSelect").appendChild(currentSect);
      let title = document.createElement("div");
      title.appendChild(document.createTextNode(blockSelect[i]));
      title.style.minWidth = "100%";
      currentSect.appendChild(title);
      blockAmt = 0;
    } else {
      let blockDisp = document.createElement("div");
      let button = document.createElement("canvas");
      button.id = "blockSelect" + blockSelect[i];
      button.height = blockSize;
      button.width = blockSize;
      drawBlock(button, 0, 0, blockSelect[i], 0, 0, 1, true);
      button.addEventListener("mousedown", function (input) {
        if (input.button == 0 && control.f) {
          openPropertyMenu(0, 0, blockSelect[i], true);
        } else if (input.button == 0) {
          if (player.selectedBlock[1] == player.selectedBlock[0]) {
            id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
              "0 0 0 5px #0000FF";
          } else {
            id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
          }
          if (player.selectedBlock[1] == blockSelect[i]) {
            button.style.boxShadow = "0 0 0 5px #FF00FF";
          } else {
            button.style.boxShadow = "0 0 0 5px #FF0000";
          }
          player.selectedBlock[0] = blockSelect[i];
        } else if (input.button == 2) {
          if (player.selectedBlock[0] == player.selectedBlock[1]) {
            id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
              "0 0 0 5px #FF0000";
          } else {
            id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
          }
          if (player.selectedBlock[0] == blockSelect[i]) {
            button.style.boxShadow = "0 0 0 5px #FF00FF";
          } else {
            button.style.boxShadow = "0 0 0 5px #0000FF";
          }
          player.selectedBlock[1] = blockSelect[i];
        }
      });
      if (hasProperty(blockSelect[i])) {
        addTooltip(button, "[F] + LMB to edit default properties");
      }
      blockDisp.style.width = blockSize + "px";
      blockDisp.style.marginRight = "5px";
      blockDisp.appendChild(button);
      blockDisp.appendChild(document.createElement("br"));
      blockDisp.appendChild(document.createTextNode(blockName[blockSelect[i]]));
      currentSect.appendChild(blockDisp);
      blockAmt++;
      currentSect.style.minWidth = (blockSize + 5) * blockAmt + "px";
    }
  }
  id("blockSelect0").style.boxShadow = "0 0 0 5px #0000FF";
  id("blockSelect1").style.boxShadow = "0 0 0 5px #FF0000";
}

init();
window.requestAnimationFrame(nextFrame);
