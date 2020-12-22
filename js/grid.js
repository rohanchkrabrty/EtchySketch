const canvas = document.querySelector("#canvas");
//canvas width == canvas container width or height ( whichever is smaller ) - 50(padding)
const canvasWidth = (Math.min(document.querySelector(".canvas-container").clientHeight, document.querySelector(".canvas-container").clientWidth) - 50);

function initialize() {
    canvas.width = canvasWidth;
    canvas.height = canvasWidth;
}

initialize();