function $(selector) {return document.querySelector(selector)}

//insert JS code here!
document.addEventListener("DOMContentLoaded", () => {
    popHomePage();


})



function popHomePage() {
    createHeaderBar();
    let img = document.createElement("img");
    img.setAttribute("src", "images/homepagef1.jpg");
    let figure = document.createElement("img");
    $("body").appendChild(figure);
    figure.appendChild(img);
}

function createHeaderBar() {
    let header = document.createElement("header");
    let logo = document.createElement("img");
    logo.setAttribute("src", "images/f1logo.svg");
    $("body").appendChild(header);
    header.appendChild(logo);
}