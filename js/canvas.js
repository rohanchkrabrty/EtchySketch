const gridCanvas = document.querySelector("#grid-canvas");
const gridCtx = gridCanvas.getContext("2d");
let gridLines, canvasWidth, cellWidth;

function initializeCanvas() {
    /*
    * Since Canvas is square, we need to take the min value of the container to prevent overflow and keep canvas centered 
    * canvas width == canvas container width or height ( whichever is smaller ) - 50(padding) 
    * Also we need to make sure that the canvas width is equally divided into cols and rows, to prevent fractional grid lines.
    TODO : fix for retina display
    */
    gridLines = Number(document.querySelector("#grid-lines").innerText);
    canvasWidth = (Math.min(document.querySelector(".canvas-container").clientHeight, document.querySelector(".canvas-container").clientWidth) - 50);
    cellWidth = Math.floor(canvasWidth / gridLines);
    //changing canvas width to keep everything in whole numbers
    canvasWidth = cellWidth * gridLines;
    gridCanvas.width = canvasWidth;
    gridCanvas.height = canvasWidth;
    
    drawGrid();
}

function drawGrid() {
    //TODO: clean canvas then draw
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
    //TODO clear given canvas
}
initializeCanvas();