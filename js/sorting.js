const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}


/////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO
/////////////////////////////////////////////////////////////////////////////////////////////
let audioCtx = null;
let audioOn = true;

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
const BARCOLOR = "488fec";
const DONEBARCOLOR = "#3fcf1b";

let numOfBars = defaultValue;

function updateRandom() {
  numOfBars = slider.value;
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

function randomize() {
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
	for (let n = start; n < end; n++) {
		container.children[n].style.backgroundColor = DONEBARCOLOR;
		if (audioOn) {
			playNote(200 + values[n] * 10);
		}
		await delay(speed);
	}
}

const swapBars = (indexOne, indexTwo) => {
	const temp = barHeightValues[indexOne];
	barHeightValues[indexOne] = barHeightValues[indexTwo];
	barHeightValues[indexTwo] = temp;

	// Update the corresponding bars' heights
	const bar1 = container.children[indexOne];
	const bar2 = container.children[indexTwo];
	const tempHeight = bar1.style.height;
	bar1.style.height = bar2.style.height;
	bar2.style.height = tempHeight;
}

const playAudio = (indexOne, indexTwo) => {
	if (audioOn) {
		playNote(200 + values[indexTwo] * 10);
		playNote(200 + values[indexOne] * 10);
	}
}



// LINEAR SORT
async function linearSort() {
  for (let i = 0; i < barHeightValues.length; i++) {
    for (let j = i + 1; j < barHeightValues.length; j++) {
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
}





// BUBBLE SORT
async function bubbleSort() {
  for (let i = 0; i < barHeightValues.length; i++) {
    for (let j = 0; j < barHeightValues.length - i; j++) {
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
}








// SELECTION SORT
async function selectionSort() {
  for (let i = 0; i < barHeightValues.length; i++) {
		let currentMin = i;
    for (let j = i + 1; j < barHeightValues.length; j++) {
			if (barHeightValues[j] < barHeightValues[currentMin]) {
				currentMin = j;
				// Add a delay to visualize the swap
				await delay(speed * 5);
			}
		}

		if (currentMin !== i) {
			swapBars(currentMin, i);

			playAudio(currentMin, i);
		}

  }

	await delay(200);

	colorFromRange(0, barHeightValues.length);
}









// INSERTION SORT
async function insertionSort() {
  for (let i = 1; i < barHeightValues.length; i++) {
    let j = i;
		while (j > 0 && barHeightValues[j - 1] > barHeightValues[j]) {
			swapBars(j, j - 1);

			playAudio(j - 1, j);

			await delay(speed * 5);

			j -= 1;
		}
	}

	await delay(200);

	colorFromRange(0, barHeightValues.length);
}











// MERGE SORT
async function mergeSort() {
  await mergeSortHelper1(barHeightValues);

	await delay(200);

	colorFromRange(0, barHeightValues.length);
}

async function mergeSortHelper1(a) {
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
  let c = [];

  while (a.length > 0 && b.length > 0) {
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
    if (!c.includes(a[0])) {
      c.push(a[0]);
    }
    a.shift();
  }

  while (b.length > 0) {
    if (!c.includes(b[0])) {
      c.push(b[0]);
    }
    b.shift();
  }

	// Swap elements and update bars' heights
	if (barHeightValues.length > 0) {
		for (let i = 0; i < c.length; i++) {
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
  await quickSortHelper(barHeightValues, 0, barHeightValues.length - 1);
  colorFromRange(0, barHeightValues.length);
}

async function quickSortHelper(a, low, high) {
  if (low < high) {
    const pivotIndex = await quickSortHelper2(a, low, high);
    await quickSortHelper(a, low, pivotIndex - 1);
    await quickSortHelper(a, pivotIndex + 1, high);
  }
}

async function quickSortHelper2(a, low, high) {
  const pivot = a[low];
  let leftWall = low;

  for (let i = low + 1; i <= high; i++) {
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

  return leftWall;
}






// HEAP SORT
async function heapSort() {
  
}











// RADIX SORT
async function radixSort() {
  
}












// BUCKET SORT
async function bucketSort() {
  
}











// BOGO SORT
async function bogoSort() {

	while (!checkIfDone()) {
		for (let i = 0; i < barHeightValues.length; i++) {
      const j = Math.floor(Math.random() * barHeightValues.length);
			playAudio(j, i);
			swapBars(i, j);
    }


		await delay(speed * 5);
	}

  colorFromRange(0, barHeightValues.length);
}

const checkIfDone = () => {

	for (let i = 1; i < barHeightValues.length; i++) {
		if (barHeightValues[i - 1] > barHeightValues[i]) {
			return false;
		}
	}

	return true;
}