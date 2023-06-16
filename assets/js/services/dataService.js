export function fetchJson(jsonFile){
    return fetch(relativePath(jsonFile))
        .then(response => response.json())
        .then(json_data => {
            return json_data;
        })
        .catch(error => console.error('Error fetching data:', error));
}

export function fetchText(textFile){
    return fetch(relativePath(textFile))
        .then(response => response.text())
        .then(textData => {
            return textData;
        })
        .catch(error => console.error('Error fetching data:', error));
}

function relativePath(path){
    const currentPath = window.location.pathname;
    const currentPathArray = currentPath.split("/");
    const currentPathArrayLength = currentPathArray.length;
    const relativePathArray = [];
    for (let i = 0; i < currentPathArrayLength - 1; i++) {
        relativePathArray.push("..");
    }
    relativePathArray.push(path);
    return relativePathArray.join("/");
}