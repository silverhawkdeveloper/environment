window.onload = iniciar;

function iniciar() {
    const boton = document.getElementById('boton');
    boton.addEventListener('click', enviarJson);
}

function enviarJson() {
    const arrayInput = document.querySelectorAll('input');
    let terminada;
    arrayInput[4].checked ? terminada = arrayInput[4] : terminada = arrayInput[5];
    let json = {
        titulo: arrayInput[0].value, cadena: arrayInput[1].value,
        director: arrayInput[2].value, anyo: parseInt(arrayInput[3].value), terminada: terminada.checked
    };
    solicitudHTTP(json)
}

function solicitudHTTP(json) {
    const resultado = document.getElementById('resultado');
    const cabeceraPost = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    };
    const solicitudPost = new Request('create_serie.php');
    const cabeceraGet = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    const solicitudGet = new Request('listar_series.php');

    fetch(solicitudPost, cabeceraPost)
        .then((respuesta) => {
            resultado.innerHTML = respuesta.statusText;
            // A este fetch que le tenemos que pasar?
            fetch(solicitudGet, cabeceraGet)
                .then((respuesta) => {
                    resultado.innerHTML = respuesta;
                })
                .catch((error) => {
                    resultado.innerHTML = error;
                });
        })
        // Como puede entrar aqui?
        .catch((error) => {
            resultado.innerHTML = error;
        });
}