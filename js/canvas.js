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
export function drawCell(ctx, x, y, cellWidth, cellHeight, color) {
    //draws a filled cell of cellWidth x cellHeight with given color
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellWidth, cellHeight);
}
export function clearCell(ctx, x, y, cellWidth, cellHeight) {
    ctx.clearRect(x, y, cellWidth, cellHeight);
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