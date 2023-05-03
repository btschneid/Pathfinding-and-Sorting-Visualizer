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
      visitedTiles[i].element.style.backgroundColor = 'white';
    }
  }

  visitedTiles = [];
}


const checkToStart = () => {
  return (endTile > -1 && startTile > -1);
}