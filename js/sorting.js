const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}


/////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO
/////////////////////////////////////////////////////////////////////////////////////////////
let audioCtx = null;
let audioOn = true;
let currentAlgOn = false;

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
  }
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.008;
  gainNode.connect(audioCtx.destination);
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.type = "triangle"; // change the oscillator type
  osc.frequency.value = freq;
  osc.connect(gainNode);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

const audioToggle = document.getElementById('audioToggle');
audioToggle.addEventListener('change', () => {
  toggleAudio();
});

function toggleAudio() {
  audioOn = !audioOn;
}




/////////////////////////////////////////////////////////////////////////////////////////////
// Creating Bars
/////////////////////////////////////////////////////////////////////////////////////////////
const container = document.querySelector('.sorting-container');
const containerHeight = container.clientHeight ;
const slider = document.getElementById("mySlider");
const defaultValue = slider.defaultValue;
const BARCOLOR = "#488fec";
const DONEBARCOLOR = "#3fcf1b";
const CURRENTBARCOLOR = "red";

let notDone = true;

let numOfBars = defaultValue;

function updateRandom() {
  numOfBars = slider.value;
	console.log(numOfBars);
  randomize();
}

const speedSlider = document.getElementById("mySlider2");
const defaultSpeedSlider = speedSlider.defaultValue;
const sliderMax = speedSlider.max;
let speed = ((sliderMax - defaultSpeedSlider) * 10) / sliderMax;

function updateSpeed() {
  speed = ((sliderMax - speedSlider.value) * 10) / sliderMax;
  console.log(speed);
}

let values = [];
let barHeightValues = [];

let numOfComparisons = 0;
const outputP = document.getElementById("comparison-count");
outputP.textContent = "Comparisons: ";

function updateComparisonNum() {
	numOfComparisons++;
	outputP.textContent = "Comparisons: " + numOfComparisons;
}

let numSwaps = 0;
const outputSwap = document.getElementById("swap-count");
outputSwap.textContent = "Swaps: ";

function updateSwapNum() {
	numSwaps++;
	outputSwap.textContent = "Swaps: " + numSwaps;
}

const timeComplex = document.getElementById("time-complexity");
timeComplex.textContent = "Time Complexity: ";

function updateTimeComplexity(input) {
	// Change the bars' colors back to BARCOLOR
  setTimeout(() => {
    timeComplex.textContent = "Time Complexity: " + input;
  }, 80);
}

function randomize() {
	notDone = true;
	numOfComparisons = 0;
	numSwaps = 0;
	timeComplex.textContent = "Time Complexity: ";
	outputSwap.textContent = "Swaps: ";
	outputP.textContent = "Comparisons: ";
	currentAlgOn = false;
	let barsArray = [];
	barHeightValues = [];
  container.innerHTML = '';

  // Calculate the maximum possible bar height based on the height of the container and the number of bars
  const maxBarHeight = containerHeight;

  // Calculate the step size for the height of each bar
  const stepSize = Math.floor(maxBarHeight / numOfBars);
	const barWidth = (container.clientWidth - 2 * (numOfBars - 1)) / numOfBars; // subtracting margins

  // Create an array with values from 1 to numOfBars
  values = Array.from({length: numOfBars}, (_, i) => i + 1);

  // Create a bar for each value and set its height to a value based on the step size and the index of the bar
  for (let i = 0; i < values.length; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${stepSize * (i + 1)}px`;
		bar.style.width = `${barWidth}px`;
    barsArray.push(bar);
  }

	// Shuffle the values randomly
  for (let i = barsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [barsArray[i], barsArray[j]] = [barsArray[j], barsArray[i]];
		barHeightValues.push(parseInt(barsArray[i].style.height));
		container.appendChild(barsArray[i]);
  }
}

window.onload = function() {
	values = []
  randomize();
}





/////////////////////////////////////////////////////////////////////////////////////////////
// Algorithms
/////////////////////////////////////////////////////////////////////////////////////////////

async function colorFromRange(start, end) {
	notDone = false;
	for (let n = start; n < end; n++) {
		if (!currentAlgOn) {
			return;
		}
		container.children[n].style.backgroundColor = DONEBARCOLOR;
		if (audioOn) {
			playNote(200 + values[n] * 10);
		}
		await delay(speed);
	}
}

const swapBars = (indexOne, indexTwo) => {
	updateSwapNum();
  // Highlight the bars in CURRENTBARCOLOR
  const bar1 = container.children[indexOne];
  const bar2 = container.children[indexTwo];
  bar1.style.backgroundColor = CURRENTBARCOLOR;
  bar2.style.backgroundColor = CURRENTBARCOLOR;

  // Swap the values in the array
  const temp = barHeightValues[indexOne];
  barHeightValues[indexOne] = barHeightValues[indexTwo];
  barHeightValues[indexTwo] = temp;

  // Update the corresponding bars' heights
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;

  // Change the bars' colors back to BARCOLOR
  setTimeout(() => {
		if (notDone) {
			bar1.style.backgroundColor = BARCOLOR;
    	bar2.style.backgroundColor = BARCOLOR;
		}
  }, speed * 100);
}

const playAudio = (indexOne, indexTwo) => {
	if (audioOn) {
		playNote(200 + values[indexTwo] * 10);
		playNote(200 + values[indexOne] * 10);
	}
}

async function checkToStart() {
	if (currentAlgOn) {
		currentAlgOn = false;
		await delay(75);
		randomize();
	}
	currentAlgOn = true;
}



// LINEAR SORT
async function linearSort() {
	updateTimeComplexity('O(n)');
	await checkToStart();
  for (let i = 0; i < barHeightValues.length; i++) {
    for (let j = i + 1; j < barHeightValues.length; j++) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
      if (barHeightValues[j] < barHeightValues[i]) {
        
				// Swap
				swapBars(i, j);

				// Play audio
				playAudio(i, j);

        // Add a delay to visualize the swap
        await delay(speed * 5);
      }
    }
  }

	await delay(200);

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}





// BUBBLE SORT
async function bubbleSort() {
	updateTimeComplexity('O(n' + '\u00B2' + ')');
	await checkToStart();
  for (let i = 0; i < barHeightValues.length; i++) {
    for (let j = 0; j < barHeightValues.length - i; j++) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
      if (barHeightValues[j] > barHeightValues[j + 1]) {
				// Swap
				swapBars(j, j + 1);

				// Play audio
				playAudio(j, j + 1);

        // Add a delay to visualize the swap
        await delay(speed * 5);
      }
    }
  }

	await delay(200);

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}








// SELECTION SORT
async function selectionSort() {
	updateTimeComplexity('O(n' + '\u00B2' + ')');
	await checkToStart();
  for (let i = 0; i < barHeightValues.length; i++) {
		let currentMin = i;
    for (let j = i + 1; j < barHeightValues.length; j++) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
			if (barHeightValues[j] < barHeightValues[currentMin]) {
				currentMin = j;
				// Add a delay to visualize the swap
				await delay(speed * 8);
			}
		}

		if (currentMin !== i) {
			swapBars(currentMin, i);

			playAudio(currentMin, i);
		}

  }

	await delay(200);

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}









// INSERTION SORT
async function insertionSort() {
	updateTimeComplexity('O(n' + '\u00B2' + ')');
	await checkToStart();

  for (let i = 1; i < barHeightValues.length; i++) {
    let j = i;
		while (j > 0 && barHeightValues[j - 1] > barHeightValues[j]) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
			swapBars(j, j - 1);

			playAudio(j - 1, j);

			await delay(speed * 5);

			j -= 1;
		}
	}

	await delay(200);

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}











// MERGE SORT
async function mergeSort() {
	updateTimeComplexity('O(n log n)');
	await checkToStart();
  await mergeSortHelper1(barHeightValues);

	if (!currentAlgOn) {
		return;
	}

	await delay(200);

	if (!currentAlgOn) {
		return;
	}

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}

async function mergeSortHelper1(a) {
	if (!currentAlgOn) {
		return;
	}
	if (a.length == 1) {
		return a;
	}

	let midpoint = Math.ceil(a.length / 2);
	let firstHalf = a.slice(0, midpoint);
	let secondHalf = a.slice(-midpoint);


	firstHalf = await mergeSortHelper1(firstHalf);
	secondHalf = await mergeSortHelper1(secondHalf);


	return await mergeSortHelper2(firstHalf, secondHalf);
}

async function mergeSortHelper2(a, b) {
	if (!currentAlgOn) {
		return;
	}

  let c = [];

  while (a.length > 0 && b.length > 0) {
		if (!currentAlgOn) {
			return;
		}

    if (a[0] > b[0]) {
      if (!c.includes(b[0])) {
        c.push(b[0]);
      }
      b.shift();
    } else {
      if (!c.includes(a[0])) {
        c.push(a[0]);
      }
      a.shift();
    }
  }

  while (a.length > 0) {
		if (!currentAlgOn) {
			return;
		}

    if (!c.includes(a[0])) {
      c.push(a[0]);
    }
    a.shift();
  }

  while (b.length > 0) {
		if (!currentAlgOn) {
			return;
		}

    if (!c.includes(b[0])) {
      c.push(b[0]);
    }
    b.shift();
  }

	// Swap elements and update bars' heights
	if (barHeightValues.length > 0) {
		for (let i = 0; i < c.length; i++) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
			if (barHeightValues[i] !== c[i]) {
				let j = barHeightValues.indexOf(c[i]);
				swapBars(i, j);
				playAudio(j, i);
				await delay(speed * 5);
			}
		}
	}

  return c;
}










// QUICK SORT
async function quickSort() {
	updateTimeComplexity('O(n log n) average case, O(n^2) worst case');
	await checkToStart();
  await quickSortHelper(barHeightValues, 0, barHeightValues.length - 1);
	if (!currentAlgOn) {
		return;
	}
  colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}

async function quickSortHelper(a, low, high) {
	if (!currentAlgOn) {
		return;
	}
  if (low < high) {
    const pivotIndex = await quickSortHelper2(a, low, high);
    await quickSortHelper(a, low, pivotIndex - 1);
    await quickSortHelper(a, pivotIndex + 1, high);
  }
}

async function quickSortHelper2(a, low, high) {
	if (!currentAlgOn) {
		return;
	}
  const pivot = a[low];
  let leftWall = low;

  for (let i = low + 1; i <= high; i++) {
		if (!currentAlgOn) {
			return;
		}
		updateComparisonNum();
    if (a[i] < pivot) {
      leftWall++;
      swapBars(i, leftWall);
      playAudio(leftWall, i);
      await delay(speed * 5);
    }
  }


  swapBars(low, leftWall);
  playAudio(leftWall, low);
  await delay(speed * 5);

	if (!currentAlgOn) {
		return;
	}

  return leftWall;
}






// HEAP SORT
async function heapSort() {
	updateTimeComplexity('O(n log n)');
	await checkToStart();

	await heapSortMain(barHeightValues);
	if (!currentAlgOn) {
		return;
	}

	colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}

async function heapSortMain(a) {
	await buildMaxHeap(a);
	let n = a.length;
	for (let i = n - 1; i > 0; i--) {
		if (!currentAlgOn) {
			return;
		}
		updateComparisonNum();
		swapBars(0, i);
		playAudio(i, 0);
		await delay(speed * 5);
		n--;
		await heapify(a, 0, n);
	}

	return a;
}

async function buildMaxHeap(a) {
	let n = a.length;

	for (let i = Math.floor(n / 2); i >= 0; i--) {
		if (!currentAlgOn) {
			return;
		}
		await heapify(a, i, n);
	}
}

async function heapify(a, i, n) {
	if (!currentAlgOn) {
		return;
	}
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  let max = i;

  if (left < n && a[left] > a[max]) {
    max = left;
  }

  if (right < n && a[right] > a[max]) {
    max = right;
  }

  if (max !== i) {
		if (!currentAlgOn) {
			return;
		}
		updateComparisonNum();
		swapBars(max, i);
		playAudio(i, max);
		await delay(speed * 5);
    await heapify(a, max, n);
  }
}





















// BOGO SORT
async function bogoSort() {
	updateTimeComplexity('O((n+1)!) on average, O(infinity) worst case');
	await checkToStart();
	while (!checkIfDone()) {
		for (let i = 0; i < barHeightValues.length; i++) {
			if (!currentAlgOn) {
				return;
			}
			updateComparisonNum();
      const j = Math.floor(Math.random() * barHeightValues.length);
			playAudio(j, i);
			swapBars(i, j);
    }


		await delay(speed * 5);
	}

  colorFromRange(0, barHeightValues.length);
	currentAlgOn = true;
}

const checkIfDone = () => {

	for (let i = 1; i < barHeightValues.length; i++) {
		if (barHeightValues[i - 1] > barHeightValues[i]) {
			return false;
		}
	}

	return true;
}