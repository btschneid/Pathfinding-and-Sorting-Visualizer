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
      
      visitedAnimation(this, selectedColor);
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

      if (isMouseDown && editMode && selectedColor === 'black' && !this.isTileWall()) {
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
              previousEndTile.element.style.backgroundColor = 'white';
            }
      
            this.setTileNotWall();
            endTile = this.number;
            previousEndTile = this;
            this.element.style.backgroundColor = 'red';
          }
          
        }

        if (clickedOnToMove == 1) {
          if (!this.isTileWall() && this.number !== endTile && previousStartTile !== this) {
            if (previousStartTile) {
              previousStartTile.element.style.backgroundColor = 'white';
            }
      
            this.setTileNotWall();
            startTile = this.number;
            previousStartTile = this;
            this.element.style.backgroundColor = 'green';
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