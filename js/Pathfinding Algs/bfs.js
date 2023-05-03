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