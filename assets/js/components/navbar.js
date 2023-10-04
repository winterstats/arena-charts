import {fetchText} from "../services/data-service.js";


function addHighlight() {
    const path = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute("href").split("/").pop() === path) {
            links[i].ariaCurrent = "page";
            // const div = links[i].closest("div");
            // if (div.classList.contains("collapse")) {
            //     const category = div.previousElementSibling;
            //     category.classList.remove("collapsed");
            //     category.setAttribute("aria-expanded", "true");
            //     const collapse = new bootstrap.Collapse(div, { toggle: true })
            // }
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
