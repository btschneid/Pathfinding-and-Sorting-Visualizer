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
  pathFindingDone = false;
  if (type === 'euclidean') {
    currentAlg = 4;
  } else {
    currentAlg = 5;
  }
  astarTime(30, type)
}

async function astarTime(delayTime, type) {
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
      break;
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

  // Color the path from end to start

  pathFindingDone = true;
}