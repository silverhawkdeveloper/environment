/*************************** GET ***************************/
//FETCH
fetch("pagina.json/php")
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
            let resuesta = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "pagina.json");
    xhr.send();
}

/*************************** POST ***************************/
//FETCH
fetch("pagina.json/php", {
    method: "POST",
    headers: {
        "Content-type": "application/json",
    },
    body: JSON.stringify(datos),
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
            let respuesta = JSON.parse(xhr.responseText);
        }
    };
    xhr.open('POST', 'pagina.json/php');
    xhr.send(datos);
}