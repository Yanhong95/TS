"use strict";
var userName = 'CYH';
console.log(userName);
var button = document.querySelector('button');
if (button) {
    button.addEventListener('click', function () {
        console.log('Clicked!');
    });
}
function clickHandler(message) {
    console.log('Clicked!' + message);
}
if (button) {
    button.addEventListener("click", clickHandler.bind(null, "you're welcome"));
}
