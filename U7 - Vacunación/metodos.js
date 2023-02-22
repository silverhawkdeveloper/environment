/*************************** GET ***************************/
//FETCH
fetch("pagina.json")
    .then((respuesta) => {
        if (respuesta.ok) return respuesta.json();
    })
    .then((datos) => {
        return datos;
    });
    
//XMLHTTPREQUEST
if (XMLHttpRequest) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "pagina.json");
    xhr.send();
}

/*************************** POST ***************************/
//FETCH
fetch("pagina.php", {
    method: "POST",
    headers: {
        "Content-type": "application/json",
    },
    body: JSON.stringify(json),
})
    .then((respuesta) => {
        if (respuesta.ok) return respuesta.json();
    })
    .then((datos) => {
        return datos;
    });

//XMLHTTPREQUEST
if (XMLHttpRequest) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            JSON.parse(xhr.responseText);
        }
    };
    xhr.open('POST', 'pagina.php');
    xhr.send(arrayJson);
}