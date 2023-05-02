const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

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
      if (selectedColor === 'green') {
        if (previousStartTile) {
          previousStartTile.element.style.backgroundColor = 'white';
        }
  
        this.setTileNotWall();
        startTile = this.number;
        previousStartTile = this;
      }
  
      if (selectedColor === 'red') {
        if (previousEndTile) {
          previousEndTile.element.style.backgroundColor = 'white';
        }
          
        this.setTileNotWall();
        endTile = this.number;
        previousEndTile = this;
      }
  
      this.element.style.backgroundColor = selectedColor;
    }

    if (selectedColor === 'black') {
      if (this.isTileWall()) {
        this.setTileNotWall();
        this.element.style.backgroundColor = 'white';
      }

      if (this.number === endTile) {
        endTile = -1;
      } else if (this.number === startTile) {
        startTile = -1;
      }
    }


    if (pathFindingDone) {
      if (this.number == endTile) {
        clickedOnToMove = 0;
      } else if (this.number == startTile) {
        clickedOnToMove = 1;
      } else {
        clickedOnToMove = -1;
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
      if (isMouseDown && editMode && selectedColor === 'black' && !this.isTileWall()) {
        this.setTileWall();
        tile.style.backgroundColor = selectedColor;

        if (this.number === endTile) {
          endTile = -1;
        } else if (this.number === startTile) {
          startTile = -1;
        }
      }

      if (isMouseDown && pathFindingDone) {
        if (clickedOnToMove == 0) {
          if (!this.isTileWall() && this.number !== startTile) {
            if (previousEndTile) {
              previousEndTile.element.style.backgroundColor = 'white';
            }
      
            this.setTileNotWall();
            endTile = this.number;
            previousEndTile = this;
            this.element.style.backgroundColor = "red";
          }
          
        }

        if (clickedOnToMove == 1) {
          if (!this.isTileWall() && this.number !== endTile) {
            if (previousStartTile) {
              previousStartTile.element.style.backgroundColor = 'white';
            }
      
            this.setTileNotWall();
            startTile = this.number;
            previousStartTile = this;
            this.element.style.backgroundColor = "green";
          }
          
        }

        if (currentAlg == 0) {
          bfsTime(0);
        } else if (currentAlg == 1) {
          dfsTime(0);
        } else if (currentAlg == 2) {
          dijTime(0);
        } else if (currentAlg == 3) {
          astarTime(0);
        } else if (currentAlg == 4) {
          greedyTime(0);
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

function maze() {
  console.log(tiles);
  console.log(startTile);
}








////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATING GRID
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Grid Size
const gridSizeX = 20;
const gridSizeY = 10;
let tileNumber = gridSizeX * gridSizeY;
let tiles = [];
let editMode = true;
let resetOn = false;

// Creates the tile map
const createTiles = () => {
  tiles = [];
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";
  const tileSize = 74;

  // Appends the tiles to the grid Container
  for (let i = 0; i < tileNumber; i++) {
    row = Math.floor(i / gridSizeX);
    col = i % gridSizeY;
    const tile = new Tile(i, row, col);
    const tileElement = tile.createElement(tileSize);
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
    if (index >= 0 && index < allTiles.length) {
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
  await delay(50);
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
    visitedTiles[i].element.style.backgroundColor = 'white';
  }

  visitedTiles = [];
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

const checkToStart = () => {
  return (endTile > -1 && startTile > -1);
}








///////////////////////
// BFS
///////////////////////

const bfs = () => {
  pathFindingDone = false;
  currentAlg = 0;
  bfsTime(30)
}

async function bfsTime(delayTime) {
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
      break;
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
            tiles[neighbor].element.style.backgroundColor = '#75a7e6';
          } else {
            visitedAnimation(tiles[neighbor], '#75a7e6');
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
        tiles[node].element.style.backgroundColor = '#f5ff5e';
      } else {
        visitedAnimation(tiles[node], '#f5ff5e');
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
  pathFindingDone = false;
  currentAlg = 1;
  dfsTime(30)
}

async function dfsTime(delayTime) {
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
      break;
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
            tiles[neighbor].element.style.backgroundColor = '#75a7e6';
          } else {
            visitedAnimation(tiles[neighbor], '#75a7e6');
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
        tiles[node].element.style.backgroundColor = '#f5ff5e';
      } else {
        visitedAnimation(tiles[node], '#f5ff5e');
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

const dijkstra = () => {
  pathFindingDone = false;
  currentAlg = 2;
  dijTime(30)
}

const calculateFCost = (tile) => {
  
}

async function dijTime(delayTime) {
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
      break;
    }
    if (delayTime > 0) {
      await delay(delayTime);
    } 

    if (node == endTile) {
      endNode = node;
      break;
    }

    /////////
    // Steps
    // 1. 

    
  }

  // Color the path from end to start

  pathFindingDone = true;
}








///////////////////////
// AStar
///////////////////////

const aStar = () => {
  pathFindingDone = false;
  currentAlg = 3;
  astarTime(30)
}

async function astarTime(delayTime) {
  
}








///////////////////////
// Greedy BFS
///////////////////////

const greedyBFS = () => {
  pathFindingDone = false;
  currentAlg = 4;
  greedyTime(30)
}

async function greedyTime(delayTime) {
  console.log("Greedy Best-First Search");
}

