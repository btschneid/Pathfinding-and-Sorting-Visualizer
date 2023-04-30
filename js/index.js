////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TILES CLASS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let startTile = -1;
let endTile = -1;
let previousStartTile = null;
let previousEndTile = null;

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
  }

  // Creates a tile as a div
  createElement = (size) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.width = size + 'px';
    tile.style.height = size + 'px';
    tile.addEventListener('click', this.handleClick.bind(this));
    
    let isMouseDown = false;
    tile.addEventListener('mousedown', () => {
      isMouseDown = true;

      if (editMode) {
        this.setTileWall();
        tile.style.backgroundColor = selectedColor;
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
  resetOn = true;
  editMode = true;
  await delay(50);
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

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

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

async function bfs() {
  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const queue = [[startTile, 0]];
  const prev = {};
  let endNode = null;

  outerLoop : while (queue.length > 0) {
    if (resetOn) {
      break;
    }
    await delay(50);
    const [node, distance] = queue.shift();
    
    if (node == endTile) {
      endNode = node;
      break;
    }

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
        if (!(tiles[neighbor].getTileNumber() == startTile)) {
          tiles[neighbor].element.style.backgroundColor = 'yellow';
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
  while (node != startTile) {
    tiles[node].element.style.backgroundColor = 'blue';
    await delay(50);
    node = prev[node];
  }
  
}

async function dfs() {
  editMode = false;
  resetOn = false;
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const array = [[startTile, 0]];
  const prev = {};
  let endNode = null;

  outerLoop : while (array.length > 0) {
    if (resetOn) {
      break;
    }
    await delay(50);
    const [node, distance] = array.pop();
    
    if (node == endTile) {
      endNode = node;
      break;
    }

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        array.push([neighbor, distance + 1]);
        if (!(tiles[neighbor].getTileNumber() == startTile)) {
          tiles[neighbor].element.style.backgroundColor = 'yellow';
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
  while (node != startTile) {
    tiles[node].element.style.backgroundColor = 'blue';
    await delay(50);
    node = prev[node];
  }
  
}


