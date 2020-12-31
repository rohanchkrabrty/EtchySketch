const gridCanvas = document.querySelector("#grid-canvas");
const drawingCanvas = document.querySelector("#drawing-canvas");
const gridCtx = gridCanvas.getContext("2d");
const drawingCtx = drawingCanvas.getContext("2d");
let paintingMode = false;

let gridLines = Number(document.querySelector("#grid-lines").innerText);
let canvasWidth, cellWidth;

function initializeCanvas() {
    /*
    * Since Canvas is square, we need to take the min value of the container to prevent overflow and keep canvas centered 
    * canvas width == canvas container width or height ( whichever is smaller ) - 50(padding) 
    * Also we need to make sure that the canvas width is equally divided into cols and rows, to prevent fractional grid lines.
    TODO : fix for retina display
    */
    canvasWidth = (Math.min(document.querySelector(".canvas-container").clientHeight, document.querySelector(".canvas-container").clientWidth) - 50);
    cellWidth = Math.floor(canvasWidth / gridLines);
    //changing canvas width to keep everything in whole numbers
    canvasWidth = cellWidth * gridLines;
    gridCanvas.style.width = canvasWidth + "px";
    gridCanvas.style.height = canvasWidth + "px";
    drawingCanvas.style.width = canvasWidth + "px";
    drawingCanvas.style.height = canvasWidth + "px";

    cellWidth = Math.floor((canvasWidth * 1) / gridLines);
    //changing canvas width to keep everything in whole numbers
    canvasWidth = cellWidth * gridLines;
    gridCanvas.width = canvasWidth;
    gridCanvas.height = canvasWidth;
    drawingCanvas.width = canvasWidth;
    drawingCanvas.height = canvasWidth;

    clearCanvas(gridCtx, gridCanvas.width, gridCanvas.height);
    clearCanvas(drawingCtx, drawingCanvas.width, drawingCanvas.height);
    drawGrid();
}

function drawGrid() {
    //TODO: clean canvas then draw
    //gridCtx.strokeStyle = "#a2a2a2";
    gridCtx.strokeStyle = "black";
    gridCtx.lineWidth = 1;
    gridCtx.beginPath();
    //drawing vertical lines
    for (let i = 1; i < gridLines; i++) {
        gridCtx.moveTo(cellWidth * i + 0.5, 0);
        gridCtx.lineTo(cellWidth * i + 0.5, gridCanvas.height);
    }
    //drawing horizontal lines
    for (let i = 1; i < gridLines; i++) {
        gridCtx.moveTo(0, cellWidth * i + 0.5);
        gridCtx.lineTo(gridCanvas.width, cellWidth * i + 0.5);
    }
    gridCtx.stroke();
}

function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}
initializeCanvas();

//canvas grid lines increase/derease
document.querySelector(".grid-controls").addEventListener("click", event => {
    if (event.target.tagName == "BUTTON" && event.target.id.includes("grid-lines")) {
        if (event.target.id.includes("increase") && gridLines < 99)
            gridLines++;
        else if (event.target.id.includes("decrease") && gridLines > 2)
            gridLines--;
        document.querySelector("#grid-lines").innerText = gridLines;
        initializeCanvas();
    } else if (event.target.tagName == "BUTTON" && event.target.id.includes("toggle-lines")) {
        gridCanvas.classList.toggle("active");
    }
});
//canvas clearAll i.e. clear drawing canvas
document.querySelector("#clear-all").addEventListener("click", ()=>{
    clearCanvas(drawingCtx, drawingCanvas.width, drawingCanvas.height);
});

//canvas drawing
document.querySelector("#grid-canvas").addEventListener("click", () => paintingMode = !paintingMode);
document.querySelector("#grid-canvas").addEventListener("mousemove", e => {
    if (paintingMode) {
        drawingCtx.fillStyle = document.querySelector("#active-color").style.backgroundColor;
        let currentCell = getCurrentCell(e);
        drawingCtx.fillRect(currentCell.left, currentCell.top, cellWidth, cellWidth);
    }
});
function getCurrentCell(e) {
    //returns current canvas cell index
    let rect = gridCanvas.getBoundingClientRect();
    return {
        left: Math.floor((e.clientX - rect.left) / cellWidth) * cellWidth,
        top: Math.floor((e.clientY - rect.top) / cellWidth) * cellWidth
    }
}