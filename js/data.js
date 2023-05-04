export function fetchData(jsonFile){
    return fetch(jsonFile)
        .then(response => response.json())
        .then(json_data => {
            return json_data;
        })
        .catch(error => console.error('Error fetching data:', error));
}
