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

// Creates the tile map
const createTiles = () => {
  tiles = [];
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";
  const tileSize = 49;

  // Appends the tiles to the grid Container
  for (let i = 0; i < tileNumber; i++) {
    row = Math.floor(i / gridSizeX);
    col = i % gridSizeX;
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