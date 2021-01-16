import * as canvas from "./canvas.js";

const SLIDER = document.querySelector(".slider");

let activeColor, activeColorHex;

activeColor = document.querySelector("#active-color");
activeColorHex = document.querySelector("#hex");


//-----------------popup module-------------
document.querySelector(".popup-module button").addEventListener("click", () => {
    document.querySelector(".popup-module").classList.remove("active");
});
document.querySelector(".tab .options").addEventListener("click", event => {
    //check if clicked tab is active or not
    if (!event.target.classList.contains("active") && event.target.tagName == "LI") {
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        //remove active class from active tab
        document.querySelector(".active").classList.remove("active");
        event.target.classList.add("active");
        //adjust slider
        SLIDER.style.left = `calc(((50% - 4px) * ${index}) + 4px)`;
    }
    event.stopImmediatePropagation();
})

//-------------------color picker-------------------
const colorPicker = new iro.ColorPicker(".color-picker-box", {
    width: 204,
    color: "#EA9A39",
    layout: [
        {
            component: iro.ui.Box,
            options: {
                boxHeight: 104
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                height: 14,
                sliderType: "hue",
                sliderSize: 12
            }
        }
    ],
    display: "flex",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    handleRadius: 8,
    handleSvg: "#color-picker-handle",
    id: "color-picker-iro"
});
colorPicker.on(["mount", "color:change"], updateActiveColor);
activeColorHex.addEventListener("change", (e) => {
    colorPicker.color.hexString = e.target.value;
});
function updateActiveColor() {
    activeColor.style.backgroundColor = colorPicker.color.hexString;
    activeColorHex.value = colorPicker.color.hexString;
}
//-------------help about extension---------------
document.querySelector("#help-about").addEventListener("click", () => {
    document.querySelector(".sidebar-extension").classList.toggle("active");
});
document.querySelector("#close-extension").addEventListener("click", () => {
    document.querySelector(".sidebar-extension").classList.remove("active");
})

//----------------- CANVAS -----------------------

const gridCanvas = document.querySelector("#grid-canvas");
const drawingCanvas = document.querySelector("#drawing-canvas");
const gridLinesElement = document.querySelector("#grid-lines");
gridCanvas.ctx = gridCanvas.getContext("2d");
drawingCanvas.ctx = drawingCanvas.getContext("2d");

let gridLines, canvasSize, cellSize;
gridLines = Number(gridLinesElement.innerText);
let paintingMode = false;
let colorPickerMode = false;
let eraserMode = false;
let shaderMode = false;
let previousCell = {
    x: -1,
    y: -1
};
function initializeCanvas() {
    /*
    * Since Canvas is square, we need to take the min value of the container to prevent overflow and keep canvas centered 
    * canvas width == canvas container width or height ( whichever is smaller ) - 50(padding) 
    * Also we need to make sure that the canvas width is equally divided into cols and rows, to prevent fractional grid lines.
    TODO : fix for retina display
    */
    canvasSize = (Math.min(document.querySelector(".canvas-container").clientHeight, document.querySelector(".canvas-container").clientWidth) - 50);
    cellSize = Math.floor(canvasSize / gridLines);
    //changing canvas width to keep everything in whole numbers
    canvasSize = cellSize * gridLines;

    canvas.resizeCanvas(gridCanvas, canvasSize, canvasSize);
    canvas.resizeCanvas(drawingCanvas, canvasSize, canvasSize);
    canvas.clearCanvas(gridCanvas.ctx, canvasSize, canvasSize);
    canvas.clearCanvas(drawingCanvas.ctx, canvasSize, canvasSize);
    canvas.drawGrid(gridCanvas.ctx, canvasSize, canvasSize, cellSize, cellSize, gridLines);
    //fix for a shader + colopicker issue -  so filling the canvas with color
    drawingCanvas.ctx.fillStyle = "#ffffff";
    drawingCanvas.ctx.fillRect(0, 0, canvasSize, canvasSize);
    canvas.save(drawingCanvas.ctx, canvasSize, canvasSize);
}

//color picker
document.querySelector("#eye-dropper").addEventListener("click", () => {
    colorPickerMode = !colorPickerMode;
    gridCanvas.classList.toggle("color-picker-mode");
    updateActiveColor();
});

//shader
document.querySelector("#shader").addEventListener("click", () => shaderMode = true);
document.querySelector("#brush").addEventListener("click", () => shaderMode = false);

//remove right click context menu
gridCanvas.addEventListener("contextmenu", e => e.preventDefault());

//canvas draw and erase
gridCanvas.addEventListener("mousedown", e => {
    if (!colorPickerMode) {
        if (e.ctrlKey || e.metaKey)
            eraserMode = true;
        else
            paintingMode = true;
    }
});
document.addEventListener("mouseup", e => {
    if (colorPickerMode) {
        //update color if mouse cursor is on canvas
        let mousePos = canvas.getCanvasMousePosition(gridCanvas, e.clientX, e.clientY);
        if (mousePos.x > 0 && mousePos.y > 0) {
            colorPickerMode = false;
            gridCanvas.classList.remove("color-picker-mode");
            colorPicker.color.rgbaString = canvas.getPixelColor(drawingCanvas.ctx, mousePos.x, mousePos.y);
            updateActiveColor();
        }
    } else if (paintingMode) {
        paintingMode = false;
        let currentCell = canvas.getCurrentCell(gridCanvas, e.clientX, e.clientY, cellSize, cellSize);
        if (shaderMode)
            canvas.drawCell(drawingCanvas.ctx, currentCell, cellSize, cellSize, "#000000", 0.1);
        else
            canvas.drawCell(drawingCanvas.ctx, currentCell, cellSize, cellSize, activeColorHex.value);
        canvas.save(drawingCanvas.ctx, canvasSize, canvasSize);
    } else if (eraserMode) {
        eraserMode = false;
        let currentCell = canvas.getCurrentCell(gridCanvas, e.clientX, e.clientY, cellSize, cellSize);
        canvas.clearCell(drawingCanvas.ctx, currentCell, cellSize, cellSize);
        canvas.save(drawingCanvas.ctx, canvasSize, canvasSize);
    }
});
gridCanvas.addEventListener("mousemove", e => {
    if (colorPickerMode) {
        let mousePos = canvas.getCanvasMousePosition(gridCanvas, e.clientX, e.clientY);
        activeColor.style.backgroundColor = canvas.getPixelColor(drawingCanvas.ctx, mousePos.x, mousePos.y);
    } else if (paintingMode) {
        let currentCell = canvas.getCurrentCell(gridCanvas, e.clientX, e.clientY, cellSize, cellSize);
        if (shaderMode) {
            if (currentCell.x === previousCell.x && currentCell.y === previousCell.y);
            else{
                canvas.drawCell(drawingCanvas.ctx, currentCell, cellSize, cellSize, "#000000", 0.1);
                previousCell.x = currentCell.x;
                previousCell.y = currentCell.y;
            }
        }
        else
            canvas.drawCell(drawingCanvas.ctx, currentCell, cellSize, cellSize, activeColorHex.value);
    } else if (eraserMode && (e.ctrlKey || e.metaKey)) {
        let currentCell = canvas.getCurrentCell(gridCanvas, e.clientX, e.clientY, cellSize, cellSize);
        canvas.clearCell(drawingCanvas.ctx, currentCell, cellSize, cellSize);
    }
});
//canvas grid lines increase/derease
document.querySelector(".grid-controls").addEventListener("click", event => {
    if (event.target.tagName == "BUTTON" && event.target.id.includes("grid-lines")) {
        if (event.target.id.includes("increase") && gridLines < 99)
            gridLines++;
        else if (event.target.id.includes("decrease") && gridLines > 2)
            gridLines--;
        gridLinesElement.innerText = gridLines;
        initializeCanvas();
    } else if (event.target.tagName == "BUTTON" && event.target.id.includes("toggle-lines")) {
        gridCanvas.classList.toggle("active");
    }
});

//canvas clearAll i.e. clear drawing canvas
document.querySelector("#clear-all").addEventListener("click", () => {
    canvas.clearCanvas(drawingCanvas.ctx, canvasSize, canvasSize);
});
//keyboard listeners
document.addEventListener("keydown", e => {
    //undo listener CTRL + Z
    if ((e.ctrlKey || e.metaKey) && e.key == "z") {
        canvas.undo(drawingCanvas.ctx);
    }
    //redo listener CTRL + Y
    else if ((e.ctrlKey || e.metaKey) && e.key == "y") {
        canvas.redo(drawingCanvas.ctx);
    }
});

window.addEventListener("load",()=>{
    initializeCanvas();
    document.querySelector(".popup-module").classList.add("active");
});