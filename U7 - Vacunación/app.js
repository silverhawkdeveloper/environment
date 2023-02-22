window.onload = iniciar;

let arrayJson = new Array();

function iniciar() {
    const modificarDatos = document.getElementById('modificarDatos');
    const cargarDatosVacunaciónXML = document.getElementById('cargarDatosVacunaciónXML');
    const cargarDatosVacunaciónFetch = document.getElementById('cargarDatosVacunaciónFetch');
    const selectComunidades = document.getElementById('comunidades');

    modificarDatos.addEventListener('click', modificarTabla);
    cargarDatosVacunaciónXML.addEventListener('click', cargarDatosXML);
    cargarDatosVacunaciónFetch.addEventListener('click', cargarDatosFetch);
    selectComunidades.addEventListener('click', buscarComunidad);
}

function modificarTabla() {
    console.log('Entrando en la función modificarTabla');

    const arrayInput = document.querySelectorAll('input');
    const nombreComunidad = buscarComunidad();

    let comunidad = {
        ccaa: nombreComunidad,
        dosisAdministradas: arrayInput[0].valueAsNumber,
        dosisEntregadas: arrayInput[1].valueAsNumber,
        dosisPautaCompletada: arrayInput[2].valueAsNumber,
        porcentajeEntregadas: arrayInput[3].valueAsNumber,
        porcentajePoblacionAdministradas: arrayInput[4].valueAsNumber,
        porcentajePoblacionCompletas: arrayInput[5].valueAsNumber,
    }
    insertarComunidades(new Array(comunidad));
}

function buscarComunidad() {
    console.log('Entrando en la función buscarComunidad');

    const selectComunidades = document.getElementById('comunidades');
    let nombreComunidad;
    for (const key in selectComunidades) {
        const option = selectComunidades[key];
        if (option != null && option.selected) {
            nombreComunidad = option.innerHTML;
            //cargarComunidad(nombreComunidad);
        }
    }
    return nombreComunidad;
}

function cargarComunidad(nombreComunidad) {
    console.log('Entrando en la función cargarComunidad');

    const arrayInput = document.querySelectorAll('input');
    let objetoComunidad;

    for (const key in arrayJson) {
        const element = arrayJson[key];
        if (nombreComunidad === element.ccaa) {
            objetoComunidad = element;
        }
    }

    arrayInput[0].valueAsNumber = objetoComunidad.dosisAdministradas;
    arrayInput[1].valueAsNumber = objetoComunidad.dosisEntregadas;
    arrayInput[2].valueAsNumber = objetoComunidad.dosisPautaCompletada;
    arrayInput[3].valueAsNumber = objetoComunidad.porcentajeEntregadas;
    arrayInput[4].valueAsNumber = objetoComunidad.porcentajePoblacionAdministradas;
    arrayInput[5].valueAsNumber = objetoComunidad.porcentajePoblacionCompletas;
}

function cargarDatosXML() {
    console.log('Entrando en la función cargarDatosXML');

    if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let JsonComunidades = JSON.parse(xhr.responseText);
                filtrarJson(JsonComunidades);
                insertarComunidades(arrayJson);
            }
        };
        xhr.open('GET', 'latest.json');
        xhr.send();
    }
}

function cargarDatosFetch() {
    console.log('Entrando en la función cargarDatosFetch');

    fetch("latest.json")
        .then((respuesta) => {
            if (respuesta.ok) return respuesta.json();
        })
        .then((datos) => {
            filtrarJson(datos);
            insertarComunidades(arrayJson);
        });
}

function insertarComunidades(array) {
    console.log('Entrando en la función insertarComunidades');
    let resultado = document.getElementById('resultados');
    //FETCH

    fetch("insertar_comunidades.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(array),
    })
        .then((respuesta) => {
            if (respuesta.ok) {
                resultado.innerHTML = 'Se ha insertado en la BD';
                return respuesta.json();
            } else {
                resultado.innerHTML = 'No se ha podido insertar en la BD';
            }
        })
        .then((datos) => {
            crearTabla(datos);
            crearSelect(datos);
        });

    //XMLHTTPREQUEST
    /*
        if (XMLHttpRequest) {
            const comunidadesJson = JSON.stringify(array);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'insertar_comunidades.php');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resultado.innerHTML = 'Se ha insertado en la BD';
                    let respuesta = JSON.parse(xhr.responseText);
                    crearTabla(array)
                } else {
                    resultado.innerHTML = 'No se ha podido insertar en la BD';
                }
            };
            xhr.send(comunidadesJson);
        }
    */
}

function filtrarJson(json) {
    json.forEach(comunidad => {
        if (comunidad.ccaa != 'Totales') {
            let objetoJson = {
                "ccaa": comunidad.ccaa,
                "dosisAdministradas": comunidad.dosisAdministradas,
                "dosisEntregadas": comunidad.dosisEntregadas,
                "dosisPautaCompletada": comunidad.dosisPautaCompletada,
                "porcentajeEntregadas": comunidad.porcentajeEntregadas,
                "porcentajePoblacionAdministradas": comunidad.porcentajePoblacionAdministradas,
                "porcentajePoblacionCompletas": comunidad.porcentajePoblacionCompletas,
            }
            arrayJson.push(objetoJson);
        }
    });
    return arrayJson;
}

function crearTabla(array) {
    const divTabla = document.getElementById('tabla');
    const tabla = document.createElement('tabla');
    divTabla.appendChild(tabla);
    const filaEncabezado = document.createElement('tr');
    const rotulos = ['CCAA', 'D entregadas', 'D administradas', 'D Pausas completas', '% Entregas', '% Pob Adm', '% Pob Com'];
    tabla.appendChild(filaEncabezado);
    rotulos.forEach((rotulo) => {
        const dato = document.createElement('th');
        dato.innerHTML = rotulo;
        filaEncabezado.appendChild(dato);
    })

    array.forEach((comunidad) => {
        const filaDato = document.createElement('tr');
        tabla.appendChild(filaDato);
        for (const key in comunidad) {
            const info = comunidad[key];
            const dato = document.createElement('td');
            filaDato.appendChild(dato);
            dato.innerHTML = info;
        }
    })
}

function crearSelect(array) {
    console.log('Entrando en la función crearSelect');

    const selectComunidades = document.getElementById('comunidades');
    for (const key in array) {
        const comunidad = array[key].ccaa;
        const optionComunidad = document.createElement('option');
        selectComunidades.appendChild(optionComunidad);
        optionComunidad.value = comunidad;
        optionComunidad.innerHTML = comunidad;
    }
}