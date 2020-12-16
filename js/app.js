const SLIDER = document.querySelector(".slider");

document.querySelector(".tab .options").addEventListener("click", event => {
    //check if clicked tab is active or not
    if (!event.target.classList.contains("active")) {
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        //remove active class from active tab
        document.querySelector(".active").classList.remove("active");
        event.target.classList.add("active");
        //adjust slider
        SLIDER.style.left = `calc(((50% - 4px) * ${index}) + 4px)`;
    }
    event.stopImmediatePropagation();
})