window.onload = iniciar;

let arrayPersonajes = [];

function iniciar() {
    const botonCargarPersonajes = document.getElementById('cargarPersonajes');
    const botonGuardarXML = document.getElementById('guardarXML');
    const botonRecuperarFetch = document.getElementById('recuperarFetch');
    const botonLimpiarTabla = document.getElementById('limpiarTabla');

    botonCargarPersonajes.addEventListener('click', cargarPersonajes);
    botonGuardarXML.addEventListener('click', guardarXML);
    botonRecuperarFetch.addEventListener('click', recuperarFetch);
    botonLimpiarTabla.addEventListener('click', limpiar);
}

function cargarPersonajes() {
    console.log('Entrando en la función cargarPersonajes');
    const divTrazas = document.getElementById('trazas');

    fetch("marvel.json")
        .then((respuesta) => {
            if (respuesta.ok) return respuesta.json();
        })
        .then((datos) => {
            mostrarPersonajes(datos.data.results);
            return divTrazas.innerHTML = datos.status;
        })
}

function mostrarPersonajes(array) {
    console.log('Entrando en la función mostrarPersonajes');
    const divPersonajes = document.getElementById('personajes');

    array.forEach((personaje) => {
        let personajeJson = crearJson(personaje);
        arrayPersonajes.push(personajeJson);
        crearTargeta(personajeJson);
    });
}

function guardarXML() {
    console.log('Entrando en la función guardarXML');
    const divTrazas = document.getElementById('trazas');
    let datos = comprobarCheck()
    if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let respuesta = JSON.parse(xhr.responseText);
                divTrazas.innerHTML = respuesta.resultado;
            }
        };
        xhr.open('POST', 'save_marvel_characters.php');
        xhr.send(JSON.stringify(datos));
    }
}

function crearJson(json) {
    console.log('Entrando en la función crearJson');
    let comics = '';
    json.comics.items.forEach(comic => {
        comics += comic.name + '<br>';
    });
    let personaje =
    {
        id: json.id,
        name: json.name,
        modified: json.modified,
        path: json.thumbnail.path + '.' + json.thumbnail.extension,
        comics: comics
    }
    return personaje;
}

function comprobarCheck() {
    console.log('Entrando en la función comprobarCheck');
    const arrayInput = document.querySelectorAll('input');
    let arrayPerOk = [];

    arrayInput.forEach((input) => {
        if (input.checked) {
            arrayPersonajes.forEach((personaje) => {
                if (personaje.id == input.value) {
                    arrayPerOk.push(personaje);
                }
            })
        }
    })
    return arrayPerOk;
}

function limpiar() {
    console.log('Entrando en la función limpiar');
    const divPersonajes = document.getElementById('personajes');
    const divTrazas = document.getElementById('trazas');
    divPersonajes.innerHTML = '';
    divTrazas.innerHTML = 'Personajes limpiados';
}

function recuperarFetch() {
    console.log('Entrando en la función recuperarFetch');
    const divPersonajes = document.getElementById('personajes');
    const divTrazas = document.getElementById('trazas');

    fetch("get_marvel_characters.php")
        .then((respuesta) => {
            if (respuesta.ok) return respuesta.json();
        })
        .then((datos) => {
            mostrarPersonajesBD(datos)
            return divTrazas.innerHTML = 'Personajes cargados';
        });
}

function mostrarPersonajesBD(array) {
    console.log('Entrando en la función mostrarPersonajesBD');
    const divPersonajes = document.getElementById('personajes');

    array.forEach(personaje => {
        crearTargeta(personaje);
    });
}

function crearTargeta(json) {
    const divPersonajes = document.getElementById('personajes');

    const div1 = document.createElement('div');
    div1.className = "card";
    div1.style = "width: 18rem;"

    const img = document.createElement('img');
    img.className = "card-img-top";
    img.src = json.path;

    const div2 = document.createElement('div');
    div2.className = "card-body";

    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.innerHTML = json.name;

    const p = document.createElement('p');
    p.className = "card-text";
    let comics;

    if (json.comics == undefined) {
        comics = '';
    } else {
        comics = json.comics
        const div3 = document.createElement('div');
        div3.className = "form-check form-switch";

        const input = document.createElement('input');
        input.className = "form-check-input";
        input.type = "checkbox";
        input.role = "switch";
        input.id = "flexSwitchCheckDefault";
        input.value = json.id;

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.for = "flexSwitchCheckDefault";

        div2.appendChild(div3);
        div3.appendChild(input);
        div3.appendChild(label);
    }

    p.innerHTML = json.modified + '<br>' + comics;

    divPersonajes.appendChild(div1);
    div1.appendChild(img);
    div1.appendChild(div2);
    div2.appendChild(h5);
    div2.appendChild(p);
}