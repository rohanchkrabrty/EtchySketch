const SLIDER = document.querySelector(".slider");
let activeColor, activeColorHex, activeColorSaturation;
activeColorHex = document.querySelector('#hex');
activeColorSaturation = document.querySelector('#saturation');

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

//color picker
const colorPicker = new iro.ColorPicker('.color-picker-box', {
    width: 204,
    color:'#EA9A39',
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
                width: 162,
                height: 14,
                sliderType: 'hue',
                sliderSize: 12
            }
        }
    ],
    display: "flex",
    padding: 0,
    margin:0,
    borderWidth: 0,
    handleRadius: 8,
    handleSvg: '#color-picker-handle',
    id: 'color-picker-iro'
});
colorPicker.on('mount', (colorObject)=>{
    //hack to add active color div after color box is loaded
    activeColor = document.createElement('div');
    activeColor.id = "active-color";
    document.querySelector('#color-picker-iro').appendChild(activeColor);
    activeColor = document.querySelector('#active-color');
    updateActiveColor(colorObject.color);
});
colorPicker.on('color:change', updateActiveColor);

function updateActiveColor(color){
    //round color saturation to whole no
    color.saturation = Math.round(color.saturation);
    activeColor.style.backgroundColor = color.hexString;
    activeColorHex.value = color.hexString;
    activeColorSaturation.value = `${color.saturation}%`;
}