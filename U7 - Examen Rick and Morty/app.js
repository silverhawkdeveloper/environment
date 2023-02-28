window.onload = iniciar;

let arrayPersonajes = new Array();

function iniciar() {
    const butonCargaXML = document.getElementById('cargaXML');
    const butonCargaFetch = document.getElementById('cargaFetch');
    const butonobtenerEpisodios = document.getElementById('obtenerEpisodios');

    butonCargaXML.addEventListener('click', cargaXML);
    butonCargaFetch.addEventListener('click', cargaFetch);
    butonobtenerEpisodios.addEventListener('click', episodiosPersonaje);
}

function cargaXML() {
    console.log('Entrando en la función cargaXML');
    const numeroMin = document.getElementById('min');
    const numeroMax = document.getElementById('max');

    for (let i = numeroMin.value; i <= numeroMax.value; i++) {
        let url = `https://rickandmortyapi.com/api/character/${i}`;
        if (XMLHttpRequest) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let resuesta = JSON.parse(xhr.responseText);
                    construirArray(resuesta);
                    if (i == numeroMax.value) {
                        construirTabla(arrayPersonajes);
                        construirSelect(arrayPersonajes)
                    }
                }
            };
            xhr.open("GET", url);
            xhr.send();
        }
    }
}

function cargaFetch() {
    console.log('Entrando en la función cargaFetch');
    const numeroMin = document.getElementById('min');
    const numeroMax = document.getElementById('max');

    for (let i = numeroMin.value; i <= numeroMax.value; i++) {
        let url = `https://rickandmortyapi.com/api/character/${i}`;
        fetch(url)
            .then((respuesta) => {
                if (respuesta.ok) return respuesta.json();
            })
            .then((datos) => {
                construirArray(datos)
                if (i == numeroMax.value) {
                    construirTabla(arrayPersonajes);
                    construirSelect(arrayPersonajes)
                }
            });
    }
}

function episodiosPersonaje() {
    console.log('Entrando en la función episodiosPersonaje');
    const option = document.querySelectorAll('option');
    let id;
    if (option != null) {
        option.forEach((personaje) => {
            if (personaje.selected) id = personaje.value;
        })
    };

    fetch(`https://rickandmortyapi.com/api/character/${id}`)
        .then((respuesta) => {
            if (respuesta.ok) return respuesta.json();
        })
        .then((datos) => {
            let arrayEpisodios = datos.episode;
            cargarEpisodios(arrayEpisodios);
        });
}

function cargarEpisodios(array) {
    console.log('Entrando en la función cargarEpisodios');
    const divRespuesta = document.getElementById('divRespuesta');
    array.forEach((peticiones) => {
        fetch(peticiones)
            .then((respuesta) => {
                if (respuesta.ok) return respuesta.json();
            })
            .then((datos) => {
                const parrafo = document.createElement('p');
                divRespuesta.appendChild(parrafo);
                parrafo.innerHTML = `Episodio ${datos.name} cargado`;
                let episodio = {
                    name: datos.name,
                    air_date: datos.air_date,
                    episode: datos.episode
                }
                guardarEpisodios(episodio);
            });
    })
}

function guardarEpisodios(json) {
    console.log('Entrando en la función guardarEpisodios');
    const divRespuesta = document.getElementById('divRespuesta');
    fetch("guardar_episodio_rm.php", {
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
            const parrafo = document.createElement('p');
            divRespuesta.appendChild(parrafo);
            parrafo.innerHTML = datos.resultado;
            return datos;
        });
}

function construirTabla(array) {
    console.log('Entrando en la función construirTabla');
    const divRespuesta = document.getElementById('divRespuesta');
    const divPersonajes = document.getElementById('divPersonajes');

    divPersonajes.innerHTML = '';
    const tabla = document.createElement('table');
    divPersonajes.appendChild(tabla);
    const filaEncabezado = document.createElement('tr');
    tabla.appendChild(filaEncabezado);
    const encabezado = ['nombre', 'especie', 'localización', 'creación', 'foto'];
    encabezado.forEach((columna) => {
        const dato = document.createElement('th');
        dato.innerHTML = columna;
        filaEncabezado.appendChild(dato);
    })

    array.forEach((personaje) => {
        const filaDato = document.createElement('tr');
        tabla.appendChild(filaDato);

        const dato1 = document.createElement('td');
        filaDato.appendChild(dato1);
        dato1.innerHTML = personaje.nombre;
        const dato2 = document.createElement('td');
        filaDato.appendChild(dato2);
        dato2.innerHTML = personaje.especie;
        const dato3 = document.createElement('td');
        filaDato.appendChild(dato3);
        dato3.innerHTML = personaje.localizacion;
        const dato4 = document.createElement('td');
        filaDato.appendChild(dato4);
        dato4.innerHTML = personaje.creacion;

        const dato5 = document.createElement('img');
        filaDato.appendChild(dato5);
        dato5.src = personaje.foto;

        const parrafo = document.createElement('p');
        divRespuesta.appendChild(parrafo);
        parrafo.innerHTML = `Personaje ${personaje.nombre} cargado`;
    })
}

function construirSelect(array) {
    console.log('Entrando en la función construirSelect');

    const selectPersonajes = document.getElementById('selectPersonajes');
    array.forEach((personaje) => {
        let option = document.createElement('option');
        selectPersonajes.appendChild(option);
        option.innerHTML = personaje.nombre;
        option.value = personaje.id;
    })
}

function construirArray(json) {
    console.log('Entrando en la función construirArray');
    let personaje = {
        id: json.id,
        nombre: json.name,
        especie: json.species,
        localizacion: json.location.name,
        foto: json.image,
        creacion: json.created
    }
    arrayPersonajes.push(personaje);
}