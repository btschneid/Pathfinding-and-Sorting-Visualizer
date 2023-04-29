let previousStartTile = null;
let previousEndTile = null;
let startTile = -1;
let endTile = -1;

class Tile {
    constructor(number, r, c) {
      this.number = number;
      this.isWall = false;
      this.isStart = false;
      this.isEnd = false;
      this.row = r;
      this.col = c;
      this.neighbors = [];
    }

    isTileEnd() {
        return this.isEnd;
    }

    setTileEnd() {
        this.isEnd = true;
    }

    setTileNotEnd() {
        this.isEnd = false;
    }

    isTileStart() {
        return this.isStart;
    }

    setTileStart() {
        this.isStart = true;
    }

    setTileNotStart() {
        this.isStart = false;
    }
    
    isTileWall() {
        return this.isWall;
    }

    setTileWall() {
        this.isWall = true;
    }

    setTileNotWall() {
        this.isWall = false;
    }

    appendNeighbors(neighbor) {
        this.neighbors.push(neighbor);
    }
  
    handleClick() {
        if (selectedColor === 'green') {
          if (previousStartTile) {
            previousStartTile.setTileNotStart();
            previousStartTile.element.style.backgroundColor = 'white';
          }
          this.setTileStart();
          this.setTileNotEnd();
          this.setTileNotWall();
          startTile = this.number;
          previousStartTile = this;
        }
    
        if (selectedColor === 'red') {
            if (previousEndTile) {
                previousEndTile.setTileNotStart();
                previousEndTile.element.style.backgroundColor = 'white';
              }
              this.setTileEnd();
              this.setTileNotStart();
              this.setTileNotWall();
              endTile = this.number;
              previousEndTile = this;
          this.setTileEnd();
        }
    
        if (selectedColor === 'black') {
          this.setTileWall();
          this.setTileNotStart();
          this.setTileNotEnd();
        }
    
        this.element.style.backgroundColor = selectedColor;
      }
  
    createElement(tileSize) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.width = `${tileSize}px`; // Set the width of each tile
      tile.style.height = `${tileSize}px`; // Set the height of each tile
      tile.addEventListener('click', this.handleClick.bind(this));
      this.element = tile;
      return tile;
    }
  }
  

const smallGridSize = 10;
const largeGridSize = 25;
let tileNumber = smallGridSize * smallGridSize;
let currentGridSize = 0;
let start = false;
let end = false;
let tiles = [];

function createSmallGrid() {
    currentGridSize = 0;
    gridSize = smallGridSize;
	tileNumber = smallGridSize * smallGridSize;
	createTiles();
}

function createLargeGrid() {
    currentGridSize = 1;
    gridSize = largeGridSize;
	tileNumber = largeGridSize * largeGridSize;
	createTiles();
}

function reset() {
    start = false;
    end = false;
    if (currentGridSize == 0) {
        createSmallGrid();
    } else {
        createLargeGrid();
    }
}

function updateNeighbors(tile, allTiles) {
  
    // Calculate the indices of the neighboring tiles
    const indices = [
      tile.number - gridSize, // Top
      tile.number + gridSize, // Bottom
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

function createTiles() {
  tiles = []
	const gridContainer = document.querySelector('.grid-container');
	gridContainer.innerHTML = '';
	const totalGapX = Math.sqrt(tileNumber) - 1; // Calculate the total number of gaps in the X direction
	const totalGapY = Math.ceil(tileNumber / Math.sqrt(tileNumber)) - 1; // Calculate the total number of gaps in the Y direction
	const tileSizeX = Math.floor((750 - totalGapX) / Math.sqrt(tileNumber)); // Calculate the size of each tile in the X direction including the gaps
	const tileSizeY = Math.floor((750 - totalGapY) / Math.ceil(tileNumber / Math.sqrt(tileNumber))); // Calculate the size of each tile in the Y direction including the gaps
	gridContainer.style.gridTemplateColumns = `repeat(${Math.sqrt(tileNumber)}, ${tileSizeX}px)`; // Use a fixed pixel value for the grid columns
	gridContainer.style.gridTemplateRows = `repeat(${Math.ceil(tileNumber / Math.sqrt(tileNumber))}, ${tileSizeY}px)`; // Use a fixed pixel value for the grid rows
	gridContainer.style.width = `${tileSizeX * Math.sqrt(tileNumber) + totalGapX}px`; // Set the width of the grid container to include the gaps between the tiles
	gridContainer.style.height = `${tileSizeY * Math.ceil(tileNumber / Math.sqrt(tileNumber)) + totalGapY}px`; // Set the height of the grid container to include the gaps between the tiles

    let row = 0;
    let col = 0;
    for (let i = 0; i < tileNumber; i++) {
        row = Math.floor(i / gridSize);
        col = i % gridSize;
        const tile = new Tile(i, row, col);
        const tileElement = tile.createElement(tileSizeX);
        tiles.push(tile);
        gridContainer.appendChild(tileElement);
    }
    
}

let selectedColor = '';

function changeColor(color) {
	selectedColor = color;
}

window.onload = function() {
  createSmallGrid();
}

function updateTileNeighbors() {
  for (let j = 0; j < tiles.length; j++) {
    updateNeighbors(tiles[j], tiles)
  }
}

function buildGraph() {
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

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}



async function bfs() {
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const queue = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  console.log(tiles);
  

  outerLoop : while (queue.length > 0) {
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
        if (!tiles[neighbor].isTileStart()) {
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
  updateTileNeighbors();
  const graph = buildGraph();
  const visited = new Set([startTile]);
  const array = [[startTile, 0]];
  const prev = {};
  let endNode = null;
  console.log(tiles);
  

  outerLoop : while (array.length > 0) {
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
        if (!tiles[neighbor].isTileStart()) {
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

function printTiles() {
  console.log(tiles);
}




