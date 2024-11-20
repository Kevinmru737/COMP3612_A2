function $(selector) {return document.querySelector(selector)}

//insert JS code here!
document.addEventListener("DOMContentLoaded", () => {
    popHomePage();


})



function popHomePage() {
    let img = document.createElement("img");
    img.setAttribute("src", "images/homepagef1.jpg");
    $("figure").appendChild(img);
}