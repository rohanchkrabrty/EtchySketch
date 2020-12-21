const SLIDER = document.querySelector(".slider");
let activeColor, activeColorHex;
activeColor = document.querySelector("#active-color");
activeColorHex = document.querySelector("#hex");

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
    color:"#EA9A39",
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
    margin:0,
    borderWidth: 0,
    handleRadius: 8,
    handleSvg: "#color-picker-handle",
    id: "color-picker-iro"
});
colorPicker.on(["mount","color:change"], updateActiveColor);
activeColorHex.addEventListener("change", (e)=>{
    colorPicker.color.hexString = e.target.value;
});
function updateActiveColor(){
    activeColor.style.backgroundColor = colorPicker.color.hexString;
    activeColorHex.value = colorPicker.color.hexString;
}
//-------------help about extension---------------
document.querySelector("#help-about").addEventListener("click", ()=>{
    document.querySelector(".sidebar-extension").classList.toggle("active");
});
document.querySelector("#close-extension").addEventListener("click", ()=>{
    document.querySelector(".sidebar-extension").classList.remove("active");
})