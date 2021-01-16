let undoStack = new Array();
let redoStack = new Array();

export function resizeCanvas(canvas, width, height, scale = 1) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * scale;
    canvas.height = height * scale;
}
export function drawGrid(ctx, width, height, cellWidth, cellHeight, gridLines, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    //drawing vertical lines
    for (let i = 1; i < gridLines; i++) {
        ctx.moveTo(cellWidth * i + 0.5, 0);
        ctx.lineTo(cellWidth * i + 0.5, height);
    }
    //drawing horizontal lines
    for (let i = 1; i < gridLines; i++) {
        ctx.moveTo(0, cellHeight * i + 0.5);
        ctx.lineTo(width, cellHeight * i + 0.5);
    }
    ctx.stroke();
}
export function drawCell(ctx, currentCell, cellWidth, cellHeight, color, opacity = 1) {
    //draws a filled cell of cellWidth x cellHeight with given color
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(currentCell.x, currentCell.y, cellWidth, cellHeight);
}
export function clearCell(ctx, currentCell, cellWidth, cellHeight) {
    ctx.clearRect(currentCell.x, currentCell.y, cellWidth, cellHeight);
}
export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

export function getCurrentCell(canvas, x, y, cellWidth, cellHeight) {
    //returns current canvas cell index from input mouse postion
    let mousePos = getCanvasMousePosition(canvas, x, y);
    return {
        x: Math.floor(mousePos.x / cellWidth) * cellWidth,
        y: Math.floor(mousePos.y / cellHeight) * cellHeight
    }
}
export function getCanvasMousePosition(canvas, x, y) {
    //returns mouse position with respect to canvas
    let rect = canvas.getBoundingClientRect();
    return {
        x: (x - rect.left),
        y: (y - rect.top)
    }
}
export function getPixelColor(ctx, x, y) {
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
}
export function save(ctx, width, height) {
    //saves the canvas state i.e adds to the undostack
    let currentCanvasData = ctx.getImageData(0, 0, width, height);
    undoStack.push(currentCanvasData);
    //clear redoStack
    redoStack.length = 0;
    console.log("canvas saved");
}
export function undo(ctx) {
    //undo the canvas if undoStack not empty
    if (undoStack.length) {
        //push currentData to redoStack
        let currentCanvasData = undoStack.pop();
        redoStack.push(currentCanvasData);

        let undoCanvasData = undoStack[undoStack.length - 1];
        ctx.putImageData(undoCanvasData, 0, 0);
        //console.log("undo");
    }
}
export function redo(ctx) {
    //redo the canvas if redoStack not empty
    if (redoStack.length) {
        let redoCanvasData = redoStack.pop();
        ctx.putImageData(redoCanvasData, 0, 0);
        //push redoCanvasData to undoStack
        undoStack.push(redoCanvasData);
        //console.log("redo");
    }
}
export function log() {
    console.log(undoStack);
    console.log(redoStack);
}