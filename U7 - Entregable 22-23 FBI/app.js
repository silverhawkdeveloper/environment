window.onload = iniciar;

let arrayCriminales = new Array();

function iniciar() {
    const botonCriminales = document.getElementById('cargaCriminales');
    const botonLimpiar = document.getElementById('limpiarTabla');
    const arrayBotonGuardar = document.getElementsByClassName('guardar');
    const botonCargaXMLHttpRequest = document.getElementById('cargaCriminalesXMLHttpRequest');
    const botonCargaFetch = document.getElementById('cargaCriminalesfetch');

    botonCriminales.addEventListener('click', cargarDatosXML);
    botonLimpiar.addEventListener('click', limpiarTabla);
    for (let i = 0; i < arrayBotonGuardar.length; i++) {
        arrayBotonGuardar[i].addEventListener('click', guardarDatosXML);
    }
    botonCargaXMLHttpRequest.addEventListener('click', cargaCriminalesXMLHttpRequest);
    botonCargaFetch.addEventListener('click', cargaCriminalesfetch);
}

function cargaCriminalesfetch() {
    console.log('Entrando en la función cargaCriminalesfetch');
    const divRespuesta = document.getElementById('respuesta');
    let objeto = { items: [] };
    fetch("get_criminals.php")
        .then((respuesta) => {
            if (respuesta.ok) {
                divRespuesta.innerHTML = 'Criminales insertados';
                return respuesta.json();
            } else {
                divRespuesta.innerHTML = 'Criminales no insertados';
            }
        })
        .then((datos) => {
            objeto.items.push(datos[0]);
            crearTabla(objeto);
        });
}

function cargaCriminalesXMLHttpRequest() {
    console.log('Entrando en la función cargaCriminalesXMLHttpRequest');
    const divRespuesta = document.getElementById('respuesta');
    let objeto = { items: [] };
    if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let respuesta = JSON.parse(xhr.responseText);
                objeto.items.push(respuesta[0]);
                crearTabla(objeto);
                divRespuesta.innerHTML = 'Criminales insertados';
            } else {
                divRespuesta.innerHTML = 'Criminales no insertados';
            }
        };
        xhr.open('GET', 'get_criminals.php');
        xhr.send();
    }
}

function buscarCriminal(uidCriminal) {
    console.log('Entrando en la función buscarCriminal');
    let criminalEncontrado = {
        uid: '',
        title: '',
        description: '',
        aliases: '',
        images: ''
    };
    arrayCriminales.forEach((criminal) => {
        if (uidCriminal == criminal.uid) {
            criminalEncontrado.uid = criminal.uid;
            criminalEncontrado.title = criminal.title;
            criminalEncontrado.description = criminal.description;
            criminalEncontrado.aliases = criminal.aliases;
            criminalEncontrado.images = criminal.images[0].original;
        }
    })
    return criminalEncontrado;
}

function guardarDatosXML() {
    console.log('Entrando en la función guardarDatosXML');
    const divRespuesta = document.getElementById('respuesta');
    let uidCriminal = this.value;
    let criminal = buscarCriminal(uidCriminal);

    if (XMLHttpRequest) {
        const criminalJson = JSON.stringify(criminal);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'save_criminal.php');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                divRespuesta.innerHTML = 'Se ha insertado en la BD';
                console.log(xhr.responseText);
                let a = JSON.parse(xhr.responseText);
                console.log(a);
            } else {
                divRespuesta.innerHTML = 'No se ha podido insertar en la BD';
            }
        };
        xhr.send(criminalJson);
    }
}

function cargarDatosXML() {
    console.log('Entrando en la función cargarDatosXML');
    const divRespuesta = document.getElementById('respuesta');

    if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonRespuesta = JSON.parse(xhr.responseText);
                arrayCriminales = jsonRespuesta.items;
                crearTabla(jsonRespuesta);
                iniciar();
                divRespuesta.innerHTML = 'Criminales insertados';
            } else {
                divRespuesta.innerHTML = 'Criminales no insertados';
            }
        };
        xhr.open('GET', 'https://api.fbi.gov/@wanted');
        xhr.send();
    }
}

function crearTabla(json) {
    console.log('Entrando en la función crearTabla');
    const divTabla = document.getElementById('tabla');
    const tabla = document.createElement('tabla');
    divTabla.appendChild(tabla);

    const filaEncabezado = document.createElement('tr');
    const rotulos = ['uid', 'title', 'description', 'aliases', 'images', 'guardar'];
    tabla.appendChild(filaEncabezado);
    rotulos.forEach((rotulo) => {
        const dato = document.createElement('th');
        dato.innerHTML = rotulo;
        filaEncabezado.appendChild(dato);
    })

    let arrayCriminales = json.items

    arrayCriminales.forEach((criminal) => {
        const filaDato = document.createElement('tr');
        tabla.appendChild(filaDato);

        const dato1 = document.createElement('td');
        filaDato.appendChild(dato1);
        dato1.innerHTML = criminal.uid;
        const dato2 = document.createElement('td');
        filaDato.appendChild(dato2);
        dato2.innerHTML = criminal.title;
        const dato3 = document.createElement('td');
        filaDato.appendChild(dato3);
        dato3.innerHTML = criminal.description;
        const dato4 = document.createElement('td');
        filaDato.appendChild(dato4);
        dato4.innerHTML = criminal.aliases;

        const dato5 = document.createElement('img');
        filaDato.appendChild(dato5);

        if (typeof (criminal.images) == 'string') {
            dato5.src = criminal.images;
        } else {
            dato5.src = criminal.images[0].original;
            const dato6 = document.createElement('td');
            filaDato.appendChild(dato6);
            const boton = document.createElement('button');
            boton.textContent = 'Guardar';
            boton.className = 'guardar';
            boton.value = criminal.uid;
            dato6.appendChild(boton);
        }
    })
}

function limpiarTabla() {
    console.log('Entrando en la función crearTabla');

    const divTabla = document.getElementById('tabla');
    const divRespuesta = document.getElementById('respuesta');
    divTabla.innerHTML = '';
    divRespuesta.innerHTML = 'Tabla limpiada'
}