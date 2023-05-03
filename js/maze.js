////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let openTiles = [];

function maze() {
  pathFindingDone = false;
  for (let i = 0; i < tiles.length; i++) {
    let r = getRow(tiles[i].number);
    let c = getCol(tiles[i].number);
    if (r % 2 == 0 && c % 2 == 0) {
      tiles[i].setTileWall();
      visitedAnimation(tiles[i], 'black');
    }
    else if (r % 2 != 1 || c % 2 != 1) {
      visitedAnimation(tiles[i], 'black');
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
        visitedAnimation(tiles[neighbor], 'white');
        visitedTiles.push(tiles[neighbor]);
      } 

      getRidOfWall(neighbor, node, 'white');

    }
    
  }

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].element.style.backgroundColor == 'black') {
      tiles[i].setTileWall();
    }
  }

  pathFindingDone = true;
}