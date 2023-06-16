import {fetchText} from "../services/dataService.js";


function addHighlight() {
    const path = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");
    for (let i = 0; i < links.length; i++) {
        console.log(path,  links[i].getAttribute("href"));
        if (links[i].getAttribute("href").split("/").pop() === path) {
            links[i].ariaCurrent = "page";
        }
    }
}

function main() {
    const container = document.getElementById("navbar-container");
    fetchText("assets/html/sidebar.html").then(htmlData => {
        container.innerHTML = htmlData;
        addHighlight();
    });
}

main();
