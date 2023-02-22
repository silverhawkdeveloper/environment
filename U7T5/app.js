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
    const xhr = new XMLHttpRequest();
    const resultado = document.getElementById('resultado');
    xhr.open('POST', 'create_serie.php');
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = function () {
        this.readyState == 4 && this.status == 200 ? resultado.innerHTML = 'Se ha inssertado en la BD' :
            resultado.innerHTML = 'No se ha podido insertar en la BD'
    };
}