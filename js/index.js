const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const visitedAnimation = (t, color) => {
  t.element.style.opacity = 0;
  t.element.style.backgroundColor = color;
  t.element.offsetWidth;
  t.element.style.opacity = 1;
  t.element.style.transition = 'opacity 0.4s ease-in-out';

  t.element.addEventListener('transitionend', function() {
    t.element.style.transition = '';
  });
}

const wallColor = 'black';
const emptyTileColor = 'white';
const visitedTileColor = '#75a7e6';
const finalPathTileColor = '#f5ff5e'
const startTileColor = 'green';
const finalTileColor = 'red';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TILES CLASS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let startTile = -1;
let endTile = -1;
let previousStartTile = null;
let previousEndTile = null;
let isMouseDown = false;
let currentAlg = -1;
let pathFindingDone = false;
let clickedOnToMove = -1;

class Tile {
  constructor(number, r, c) {
    this.number = number;
    this.isWall = false;
    this.row = r;
    this.col = c;
    this.neighbors = [];
  }

  getTileRow = () => {
    return this.row;
  }

  getTileCol = () => {
    return this.col;
  }

  isTileWall = () => {
    return this.isWall;
  }

  setTileWall = () => {
    this.isWall = true;
  }

  setTileNotWall = () => {
    this.isWall = false;
  }

  getTileNumber = () => {
    return this.tileNumber;
  }

  appendNeighbors = (neighbor) => {
    this.neighbors.push(neighbor);
  }

  handleClick = () => {
    if (editMode) {
      if (selectedColor === startTileColor) {
        if (previousStartTile) {
          previousStartTile.element.style.backgroundColor = emptyTileColor;
        }
  
        this.setTileNotWall();
        startTile = this.number;
        previousStartTile = this;
      }
  
      if (selectedColor === finalTileColor) {
        if (previousEndTile) {
          previousEndTile.element.style.backgroundColor = emptyTileColor;
        }
          
        this.setTileNotWall();
        endTile = this.number;
        previousEndTile = this;
      }
      
      visitedAnimation(this, selectedColor);
    }

    if (selectedColor === wallColor) {
      if (this.isTileWall()) {
        this.setTileNotWall();
        this.element.style.backgroundColor = emptyTileColor;
      }

      if (this.number === endTile) {
        endTile = -1;
      } else if (this.number === startTile) {
        startTile = -1;
      }
    }


  }

  // Creates a tile as a div
  createElement = (size) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.width = size + 'px';
    tile.style.height = size + 'px';
    tile.addEventListener('click', this.handleClick.bind(this));
    
    tile.addEventListener('mousedown', () => {
      isMouseDown = true;   
    });

    tile.addEventListener('mousemove', () => {
      if (isMouseDown && this.number === startTile) {
        clickedOnToMove = 1;
      } else if (isMouseDown && this.number === endTile) {
        clickedOnToMove = 0;
      }

      if (isMouseDown && editMode && selectedColor === wallColor && !this.isTileWall()) {
        this.setTileWall();
        visitedAnimation(this, selectedColor);

        if (this.number === endTile) {
          endTile = -1;
        } else if (this.number === startTile) {
          startTile = -1;
        }
      }

      if (isMouseDown && pathFindingDone) {
        if (clickedOnToMove == 0) {
          if (!this.isTileWall() && this.number !== startTile && previousEndTile !== this) {
            if (previousEndTile) {
              previousEndTile.element.style.backgroundColor = emptyTileColor;
            }
      
            this.setTileNotWall();
            endTile = this.number;
            previousEndTile = this;
            this.element.style.backgroundColor = finalTileColor;
          }
          
        }

        if (clickedOnToMove == 1) {
          if (!this.isTileWall() && this.number !== endTile && previousStartTile !== this) {
            if (previousStartTile) {
              previousStartTile.element.style.backgroundColor = emptyTileColor;
            }
      
            this.setTileNotWall();
            startTile = this.number;
            previousStartTile = this;
            this.element.style.backgroundColor = startTileColor;
          }
          
        }

        if (currentAlg == 0) {
          bfsTime(0);
        } else if (currentAlg == 1) {
          dfsTime(0);
        } else if (currentAlg == 2) {
          dijTime(0, 'euclidean');
        } else if (currentAlg == 3) {
          dijTime(0, 'manhattan');
        } else if (currentAlg == 4) {
          astarTime(0, 'euclidean');
        } else if (currentAlg == 5) {
          astarTime(0, 'manhattan');
        } else if (currentAlg == 6) {
          greedyTime(0, 'euclidean');
        } else if (currentAlg == 7) {
          greedyTime(0, 'manhattan');
        }
      }


    });
    
    document.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    
    this.element = tile;
    return tile;
  }
  
}








////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATING GRID
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Grid Size
const gridSizeX = 37;
const gridSizeY = 15;
let tileNumber = gridSizeX * gridSizeY;
let tiles = [];
let editMode = true;
let resetOn = false;
let tileSize = updateTileSize();

// Listen for changes in the width of the container
window.addEventListener("resize", () => {
  const gridContainer = document.querySelector(".grid-container");
  let width = gridContainer.offsetWidth;
  let height = width * 15 / 37; // Set height to be 15/37 of the width
	
  gridContainer.style.height = `${height}px`; // Set the height of the container using the style property
  tileSize = width / 37 - 2;
  updateTileSize2();
});

function updateTileSize2() {
  for (let i = 0; i < tileElementArray.length; i++) {
    tileElementArray[i].style.width = tileSize + 'px';
    tileElementArray[i].style.height = tileSize + 'px';
  }
}

function updateTileSize() {
  const gridContainer = document.querySelector(".grid-container");
  const width = gridContainer.offsetWidth;
  const tileSize = width / 37 - 2;
  return tileSize;
}

let tileElementArray = [];

// Creates the tile map
const createTiles = () => {
  tileElementArray = [];
  tiles = [];
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  // Appends the tiles to the grid Container
  for (let i = 0; i < tileNumber; i++) {
    row = Math.floor(i / gridSizeX);
    col = i % gridSizeX;
    const tile = new Tile(i, row, col);
    const tileElement = tile.createElement(tileSize);
    tileElementArray.push(tileElement);
    tiles.push(tile);
    gridContainer.appendChild(tileElement);
  }
}

const updateNeighbors = (tile, allTiles) => {
  // Calculate the indices of the neighboring tiles
  const indices = [
    tile.number - gridSizeX, // Top
    tile.number + gridSizeX, // Bottom
    tile.number - 1, // Left
    tile.number + 1, // Right
  ];

  // Clear the existing neighbors array
  tile.neighbors = [];

  // Add the neighboring tiles to the neighbors array
  indices.forEach((index) => {
    // Check if the index is within the bounds of the array
    if (index >= 0 && index < tileNumber) {
      const neighbor = allTiles[index];

      // Check if the neighbor is in the same row or column as the tile
      if (neighbor.row === tile.row || neighbor.col === tile.col) {
        if (!neighbor.isTileWall()) tile.neighbors.push(neighbor);
      }
    }
  });
}

const updateTileNeighbors = () => {
  for (let j = 0; j < tiles.length; j++) {
    updateNeighbors(tiles[j], tiles)
  }
}

// Resets the tile map
async function reset() {
  openTiles = [];
  clickedOnToMove = -1;
  startTile = -1;
  endTile = -1;
  previousStartTile = null;
  previousEndTile = null;
  isMouseDown = false;
  resetOn = true;
  editMode = true;
  currentAlg = -1;
  pathFindingDone = false;
  //await delay(25);
  visitedTiles = []
  selectedColor = '';
  createTiles();
}

// Changes the color of the tile
let selectedColor = '';
const changeColor = (color) => {
  selectedColor = color;
}

window.onload = function() {
  createTiles();
}

const slider = document.getElementById("mySlider");
const defaultValue = slider.defaultValue;

function updateRandom() {
  const value = slider.value;
  random(value);
}

async function random(ratio) {
  reset();
  await delay(25);
  for (let i = 0; i < tiles.length; i++) {
    let randomNumber = Math.random();
    if (randomNumber < ratio) {
      tiles[i].setTileWall();
      visitedAnimation(tiles[i], wallColor);
    } 
  }
  let tiles2 = tiles;

  let startIndex = Math.floor(Math.random() * tiles2.length);
  tiles2.slice(startIndex, 1);
  let endIndex = Math.floor(Math.random() * tiles2.length);

  startTile = startIndex;
  visitedAnimation(tiles[startIndex], startTileColor);
  tiles[startIndex].setTileNotWall()
  previousStartTile = tiles[startIndex];

  endTile = endIndex;
  visitedAnimation(tiles[endIndex], finalTileColor);
  tiles[endIndex].setTileNotWall()
  previousEndTile = tiles[endIndex];
}



/////////////////////////////////////////////
// Info Stuff
/////////////////////////////////////////////
const openInfoButtons = document.querySelectorAll('[data-info-target]');
const closeInfoButtons = document.querySelectorAll('[data-close-button]');
const page1 = document.querySelector('.page1');
const page2 = document.querySelector('.page2');
const overlay = document.getElementById('overlay');

openInfoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const info = document.querySelector(button.dataset.infoTarget);
    openInfo(info);
  });
});

overlay.addEventListener('click', () => {
  const infos = document.querySelectorAll('.info.active');
  infos.forEach(info => {
    closeInfo(info);
  });
});

closeInfoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const info = button.closest('.info');
    closeInfo(info);
  });
});

function openInfo (info) {
  if (info == null) return;
  info.classList.add('active');
  overlay.classList.add('active');
}

function closeInfo (info) {
  if (info == null) return;
  info.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    resetPages();
  }, 100);
}

function togglePages() {
  page1.style.display = 'none';
  page2.style.display = 'block';
}

function resetPages() {
  page2.style.display = 'none';
  page1.style.display = 'block';
}












////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Algorithms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let visitedTiles = []

const buildGraph = () => {
  const graph = {};

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    graph[tile.number] = [];
    
    for (let j = 0; j < tile.neighbors.length; j++) {
      const neighbor = tile.neighbors[j];
      graph[tile.number].push(neighbor.number);
    }
  }
  return graph;
}

const resetVisitedTiles = () => {
  for (let i = 0; i < visitedTiles.length; i++) {
    if (visitedTiles[i].number !== startTile && visitedTiles[i].number !== endTile) {
      visitedTiles[i].element.style.backgroundColor = emptyTileColor;
    }
  }

  visitedTiles = [];
}


const checkToStart = () => {
  return (endTile > -1 && startTile > -1);
}








///////////////////////
// BFS
///////////////////////

const bfs = () => {
  resetOn = true;
  pathFindingDone = false;
  currentAlg = 0;
  bfsTime(30)
}

async function bfsTime(delayTime) {
  await delay(50);
  selectedColor = '';
  if (!checkToStart()) {
    return;
  }

  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const queue = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  resetVisitedTiles();

  outerLoop : while (queue.length > 0) {
    if (resetOn) {
      return;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 
    const [node, distance] = queue.shift();
    
    if (node == endTile) {
      endNode = node;
      break;
    }

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
        if (neighbor !== startTile && neighbor !== endTile) {
          if (delayTime == 0) {
            tiles[neighbor].element.style.backgroundColor = visitedTileColor;
          } else {
            visitedAnimation(tiles[neighbor], visitedTileColor);
          }
          visitedTiles.push(tiles[neighbor]);
        } 
        prev[neighbor] = node;
        if (endTile == neighbor) {
          endNode = neighbor;
          break outerLoop;
        }
      }
    }
  }

  // Color the path from end to start
  let node = endNode;
  while (node != startTile && !resetOn) {
    if (node !== endNode) {

      if (delayTime == 0) {
        tiles[node].element.style.backgroundColor = finalPathTileColor;
      } else {
        visitedAnimation(tiles[node], finalPathTileColor);
        await delay(delayTime); 
      }
    }
    node = prev[node];
  }

  pathFindingDone = true;
  
}






///////////////////////
// DFS
///////////////////////

const dfs = () => {
  resetOn = true;
  pathFindingDone = false;
  currentAlg = 1;
  dfsTime(30)
}

async function dfsTime(delayTime) {
  await delay(50);
  selectedColor = '';
  if (!checkToStart()) {
    return;
  }

  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const array = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  resetVisitedTiles();

  outerLoop : while (array.length > 0) {
    if (resetOn) {
      return;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 
    const [node, distance] = array.pop();
    
    if (node == endTile) {
      endNode = node;
      break;
    }

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        array.push([neighbor, distance + 1]);
        if (neighbor !== startTile && neighbor !== endTile) {
          if (delayTime == 0) {
            tiles[neighbor].element.style.backgroundColor = visitedTileColor;
          } else {
            visitedAnimation(tiles[neighbor], visitedTileColor);
          }
          visitedTiles.push(tiles[neighbor]);
        } 
        prev[neighbor] = node;
        if (endTile == neighbor) {
          endNode = neighbor;
          break outerLoop;
        }
      }
    }
  }

  // Color the path from end to start
  let node = endNode;
  while (node != startTile && !resetOn) {
    if (node !== endNode) {
      if (delayTime == 0) {
        tiles[node].element.style.backgroundColor = finalPathTileColor;
      } else {
        visitedAnimation(tiles[node], finalPathTileColor);
        await delay(delayTime); 
      }
    }
    node = prev[node];
  }

  pathFindingDone = true;
  
}






///////////////////////
// Dijkstra
///////////////////////

const addToQueueDij = (queue, tile, type) => {
  let startR = getRow(startTile);
  let startC = getCol(startTile);
  let dis = -1;

  if (type === 'euclidean') {
    dis = Math.sqrt(Math.pow(getCol(tile) - startC, 2) + Math.pow(getRow(tile) - startR, 2));
  } else if (type === 'manhattan') {
    dis = Math.abs(getCol(tile) - startC) + Math.abs(getRow(tile) - startR);
  }

  const newItem = [tile, dis];

  let i = 0;

  // Iterate through the queue and find the index where the new item should be inserted based on its fCost
  while (i < queue.length && queue[i][1] <= dis) {
    i++;
  }

  // Insert the new item at the correct index
  queue.splice(i, 0, newItem);

  return queue;
}

const dijkstra = (type) => {
  resetOn = true;
  pathFindingDone = false;
  if (type === 'euclidean') {
    currentAlg = 2;
  } else {
    currentAlg = 3;
  }
  dijTime(30, type)
}

async function dijTime(delayTime, type) {
  await delay(50);
  selectedColor = '';
  if (!checkToStart()) {
    return;
  }

  editMode = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  let prioQueue = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  resetVisitedTiles();
  resetOn = false;

  outerLoop : while (prioQueue.length > 0) {
    if (resetOn) {
      return;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 

    const [node, distance] = prioQueue.shift();

    if (node == endTile) {
      endNode = node;
      break;
    }
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        prioQueue = addToQueueDij(prioQueue, neighbor, type);
        
        if (neighbor !== startTile && neighbor !== endTile) {
          if (delayTime == 0) {
            tiles[neighbor].element.style.backgroundColor = visitedTileColor;
          } else {
            visitedAnimation(tiles[neighbor], visitedTileColor);
          }
          visitedTiles.push(tiles[neighbor]);
        } 
        prev[neighbor] = node;
        if (endTile == neighbor) {
          endNode = neighbor;
          break outerLoop;
        }
      }
    }

    
  }

  // Color the path from end to start
  let node = endNode;
  while (node != startTile && !resetOn) {
    if (node !== endNode) {
      if (delayTime == 0) {
        tiles[node].element.style.backgroundColor = finalPathTileColor;
      } else {
        visitedAnimation(tiles[node], finalPathTileColor);
        await delay(delayTime); 
      }
    }
    node = prev[node];
  }

  // Color the path from end to start

  pathFindingDone = true;
}








///////////////////////
// AStar
///////////////////////

const getRow = (num) => {
  return Math.floor(num / gridSizeX);
}

const getCol = (num) => {
  return num % gridSizeX;
}

const calculateFCost = (tile, type) => {
  let gCost, hCost = -1;
  let endR = getRow(endTile);
  let endC = getCol(endTile);
  let startR = getRow(startTile);
  let startC = getCol(startTile);

  if (type == 'euclidean') {
    gCost = Math.sqrt(Math.pow(getCol(tile) - startC, 2) + Math.pow(getRow(tile) - startR, 2));
    hCost = Math.sqrt(Math.pow(getCol(tile) - endC, 2) + Math.pow(getRow(tile) - endR, 2));
  } else if (type == 'manhattan') {
    gCost = Math.abs(getCol(tile) - startC) + Math.abs(getRow(tile) - startR);
    hCost = Math.abs(getCol(tile) - endC) + Math.abs(getRow(tile) - endR);
  } else {
    gCost = Math.abs(getCol(tile) - startC) + Math.abs(getRow(tile) - startR);
    hCost = Math.abs(getCol(tile) - endC) + Math.abs(getRow(tile) - endR);
  }

  return gCost + hCost;
}

const addToQueue = (queue, tile, type) => {
  const fCost = calculateFCost(tile, type);
  const newItem = [tile, fCost];

  let i = 0;

  // Iterate through the queue and find the index where the new item should be inserted based on its fCost
  while (i < queue.length && queue[i][1] <= fCost) {
    i++;
  }

  // Insert the new item at the correct index
  queue.splice(i, 0, newItem);

  return queue;
}


const aStar = (type) => {
  resetOn = true;
  pathFindingDone = false;
  if (type === 'euclidean') {
    currentAlg = 4;
  } else {
    currentAlg = 5;
  }
  astarTime(30, type)
}

async function astarTime(delayTime, type) {
  await delay(50);
  selectedColor = '';
  if (!checkToStart()) {
    return;
  }

  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  let prioQueue = [[startTile, calculateFCost(startTile, type)]];
  const prev = {};
  let endNode = null;
  resetVisitedTiles();

  outerLoop : while (prioQueue.length > 0) {
    if (resetOn) {
      return;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 

    const [node, fCost] = prioQueue.shift();

    if (node == endTile) {
      endNode = node;
      break;
    }
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        prioQueue = addToQueue(prioQueue, neighbor, type);
        
        if (neighbor !== startTile && neighbor !== endTile) {
          if (delayTime == 0) {
            tiles[neighbor].element.style.backgroundColor = visitedTileColor;
          } else {
            visitedAnimation(tiles[neighbor], visitedTileColor);
          }
          visitedTiles.push(tiles[neighbor]);
        } 
        prev[neighbor] = node;
        if (endTile == neighbor) {
          endNode = neighbor;
          break outerLoop;
        }
      }
    }

    
  }

  // Color the path from end to start
  let node = endNode;
  while (node != startTile && !resetOn) {
    if (node !== endNode) {
      if (delayTime == 0) {
        tiles[node].element.style.backgroundColor = finalPathTileColor;
      } else {
        visitedAnimation(tiles[node], finalPathTileColor);
        await delay(delayTime); 
      }
    }
    node = prev[node];
  }

  // Color the path from end to start

  pathFindingDone = true;
}








///////////////////////
// Greedy BFS
///////////////////////

const addToQueueGreed = (queue, tile, type) => {
  let endR = getRow(endTile);
  let endC = getCol(endTile);
  let dis = -1;

  if (type === 'euclidean') {
    dis = Math.sqrt(Math.pow(getCol(tile) - endC, 2) + Math.pow(getRow(tile) - endR, 2));
  } else if (type === 'manhattan') {
    dis = Math.abs(getCol(tile) - endC) + Math.abs(getRow(tile) - endR);
  }

  const newItem = [tile, dis];

  let i = 0;

  // Iterate through the queue and find the index where the new item should be inserted based on its fCost
  while (i < queue.length && queue[i][1] <= dis) {
    i++;
  }

  // Insert the new item at the correct index
  queue.splice(i, 0, newItem);

  return queue;
}

const greedyBFS = (type) => {
  resetOn = true;
  pathFindingDone = false;
  if (type === 'euclidean') {
    currentAlg = 6;
  } else {
    currentAlg = 7;
  }
  greedyTime(30, type)
}

async function greedyTime(delayTime, type) {
  await delay(50);
  selectedColor = '';
  if (!checkToStart()) {
    return;
  }

  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  let prioQueue = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  resetVisitedTiles();

  outerLoop : while (prioQueue.length > 0) {
    if (resetOn) {
      return;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 

    const [node, distance] = prioQueue.shift();

    if (node == endTile) {
      endNode = node;
      break;
    }
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        prioQueue = addToQueueGreed(prioQueue, neighbor, type);
        
        if (neighbor !== startTile && neighbor !== endTile) {
          if (delayTime == 0) {
            tiles[neighbor].element.style.backgroundColor = visitedTileColor;
          } else {
            visitedAnimation(tiles[neighbor], visitedTileColor);
          }
          visitedTiles.push(tiles[neighbor]);
        } 
        prev[neighbor] = node;
        if (endTile == neighbor) {
          endNode = neighbor;
          break outerLoop;
        }
      }
    }

    
  }

  // Color the path from end to start
  let node = endNode;
  while (node != startTile && !resetOn) {
    if (node !== endNode) {
      if (delayTime == 0) {
        tiles[node].element.style.backgroundColor = finalPathTileColor;
      } else {
        visitedAnimation(tiles[node], finalPathTileColor);
        await delay(delayTime); 
      }
    }
    node = prev[node];
  }

  // Color the path from end to start

  pathFindingDone = true;
}










////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let openTiles = [];

async function maze() {
  reset();
  await delay(25);
  pathFindingDone = false;
  for (let i = 0; i < tiles.length; i++) {
    let r = getRow(tiles[i].number);
    let c = getCol(tiles[i].number);
    if (r % 2 == 0 && c % 2 == 0) {
      tiles[i].setTileWall();
      visitedAnimation(tiles[i], wallColor);
    }
    else if (r % 2 != 1 || c % 2 != 1) {
      visitedAnimation(tiles[i], wallColor);
      if (r == 0 || r == gridSizeY - 1 || c == 0 || c == gridSizeX - 1) {
        tiles[i].setTileWall();
      }
    } else {
      openTiles.push(tiles[i]);
    }
    
  }
  createMazeNeighbors();
  dfsMaze();
}

const createMazeNeighbors = () => {
  for (let i = 0; i < openTiles.length; i++) {
    let tile = openTiles[i];
    // Calculate the indices of the neighboring tiles
    const indices = [
      tile.number - (gridSizeX * 2), // Top
      tile.number + (gridSizeX * 2), // Bottom
      tile.number - 2, // Left
      tile.number + 2, // Right
    ];

    // Clear the existing neighbors array
    tile.neighbors = [];

    // Add the neighboring tiles to the neighbors array
    indices.forEach((index) => {
      // Check if the index is within the bounds of the array
      if (index >= 0 && index < ((gridSizeX) * (gridSizeY))) {
        const neighbor = tiles[index];

        // Check if the neighbor is in the same row or column as the tile
        if (neighbor.row === tile.row || neighbor.col === tile.col) {
          if (!neighbor.isTileWall()) tile.neighbors.push(neighbor);
        }
      }
    });
  }
}

const buildMazeGraph = () => {
  const graph = {};

  for (let i = 0; i < openTiles.length; i++) {
    const tile = openTiles[i];
    graph[tile.number] = [];
    
    for (let j = 0; j < tile.neighbors.length; j++) {
      const neighbor = tile.neighbors[j];
      graph[tile.number].push(neighbor.number);
    }
  }
  return graph;
}

const getRidOfWall = (neighbor, node, color) => {
  neR = getRow(neighbor);
  noR = getRow(node)

  if (neR - noR == 2) {
    visitedAnimation(tiles[node + gridSizeX], color);
    return;
  } else if (neR - noR == -2) {
    visitedAnimation(tiles[node - gridSizeX], color);
    return;
  }

  neC = getCol(neighbor);
  noC = getCol(node)
  if (neC - noC == 2) {
    visitedAnimation(tiles[node + 1], color);
    return;
  } else if (neC - noC == -2) {
    visitedAnimation(tiles[node - 1], color);
    return;
  }
}


async function dfsMaze() {
  selectedColor = '';

  let delayTime = 1;
  const randStartIndex = Math.floor(Math.random() * openTiles.length);
  let s = openTiles[randStartIndex].number;
  const graph = buildMazeGraph();
  const visited = new Set([s]);
  const stack = [s];
  resetVisitedTiles();
  let neighbors = graph[s];
  let neighbor = neighbors[0];
  let node = stack[0];

  outerLoop : while (stack.length != 0) {
    node = stack[stack.length - 1];
    
    if (delayTime > 0) {
      await delay(delayTime);
    } 

    neighbors = graph[node];

    for (let i = 0; i < neighbors.length; i++) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      neighbor = neighbors[randomIndex];
      if (!visited.has(neighbor)) {
        neighbors.splice(randomIndex, 1);
        break;
      } else {
        neighbors.splice(randomIndex, 1);
      }
    }

    if (neighbors.length == 0) {
      stack.pop();
      continue;
    }

    
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      stack.push(neighbor);
      if (neighbor !== s) {
        visitedAnimation(tiles[neighbor], emptyTileColor);
        visitedTiles.push(tiles[neighbor]);
      } 

      getRidOfWall(neighbor, node, emptyTileColor);

    }
    
  }

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].element.style.backgroundColor == wallColor) {
      tiles[i].setTileWall();
    }
  }

  pathFindingDone = true;
}