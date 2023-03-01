window.onload = iniciar;

let card = {
    image: '',
    name: '',
    street: '',
    phone: '',
    email: ''
}

function setAlmacenamiento(arrayUsuario) {
    sessionStorage.setItem("arrayUsuario", JSON.stringify(arrayUsuario));
}

function getAlmacenamiento() {
    let objetoarrayUsuario = JSON.parse(sessionStorage.getItem("arrayUsuario"));
    if (objetoarrayUsuario == null) objetoarrayUsuario = new Array();
    return objetoarrayUsuario;
}

function iniciar() {
    console.log('Entrando en la función iniciar');
    const botonGenerarUsuario = document.getElementById('generarUsuario');
    const botonUsuarioTabla = document.getElementById('usuarioTabla');
    const botonGuardarXMLHttpRequest = document.getElementById('guardarXMLHttpRequest');
    const botonFetch = document.getElementById('guardarFetch');

    botonGenerarUsuario.addEventListener('click', generarUsuario);
    botonGuardarXMLHttpRequest.addEventListener('click', guardarXMLHttpRequest);
    botonFetch.addEventListener('click', guardarFetch);
    if (botonUsuarioTabla != null) {

        botonUsuarioTabla.addEventListener('click', construirTabla);
        botonUsuarioTabla.addEventListener('click', generarUsuario);
    }
}

function guardarFetch() {
    console.log('Entrando en la función guardarFetch');
    const divRespuesta = document.getElementById('respuesta');
    let datos = getAlmacenamiento();
    fetch("save_users.php", {
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
            return divRespuesta.innerHTML = datos.resultado;
        });
}

function guardarXMLHttpRequest() {
    console.log('Entrando en la función guardarXMLHttpRequest');
    const divRespuesta = document.getElementById('respuesta');
    let datos = getAlmacenamiento();
    if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let respuesta = JSON.parse(xhr.responseText);
                divRespuesta.innerHTML = respuesta.resultado;
            }
        };
        xhr.open('POST', 'save_users.php');
        xhr.send(JSON.stringify(datos));
    }
}

function generarUsuario() {
    console.log('Entrando en la función generarUsuario');
    fetch("https://randomuser.me/api/?nat=es")
        .then((respuesta) => {
            if (respuesta.ok) return respuesta.json();
        })
        .then((datos) => {
            crearJson(datos.results[0]);
            mostrarUsuario();
        });
}

function crearJson(json) {
    card.image = json.picture.thumbnail;
    card.name = json.name.title + ' ' + json.name.first + ' ' + json.name.last;
    card.street = json.location.city;
    card.phone = json.cell;
    card.email = json.email;
}

function mostrarUsuario() {
    console.log('Entrando en la función mostrarUsuario');
    const divRespuesta = document.getElementById('respuesta');
    const divUsuario = document.getElementById('usuario');
    const boton = document.createElement('button');

    divUsuario.innerHTML = `<img src=${card.image}>` + '<br>' + card.name + '<br>'
        + card.street + '<br>' + card.phone + '<br>' + card.email + '<br>';
    divUsuario.appendChild(boton);
    boton.innerHTML = 'Añadir usuario a tabla';
    boton.id = 'usuarioTabla';

    divRespuesta.innerHTML = 'Usuario Mostrado';
    iniciar();
}

function construirTabla() {
    console.log('Entrando en la función construirTabla');

    let arrayUsuario = getAlmacenamiento()
    arrayUsuario.push(card);
    setAlmacenamiento(arrayUsuario);

    const divRespuesta = document.getElementById('respuesta');
    const tableUsuario = document.getElementById('tablaUsuarios');

    if (!tableUsuario.hasChildNodes()) {
        const filaEncabezado = document.createElement('tr');
        tableUsuario.appendChild(filaEncabezado);
        const encabezado = ['name', 'street', 'phone', 'email', 'image'];
        encabezado.forEach((columna) => {
            const dato = document.createElement('th');
            dato.innerHTML = columna;
            filaEncabezado.appendChild(dato);
        })
    }

    const filaDato = document.createElement('tr');
    tableUsuario.appendChild(filaDato);

    const dato1 = document.createElement('td');
    filaDato.appendChild(dato1);
    dato1.innerHTML = card.name;
    const dato2 = document.createElement('td');
    filaDato.appendChild(dato2);
    dato2.innerHTML = card.street;
    const dato3 = document.createElement('td');
    filaDato.appendChild(dato3);
    dato3.innerHTML = card.phone;
    const dato4 = document.createElement('td');
    filaDato.appendChild(dato4);
    dato4.innerHTML = card.email;

    const dato5 = document.createElement('img');
    filaDato.appendChild(dato5);
    dato5.src = card.image;

    divRespuesta.innerHTML = 'Usuario en la tabla';
}