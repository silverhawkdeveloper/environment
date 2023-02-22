let xhr;
const READY_STATE_COMPLETE = 4;

let comunidades_json = [];
let resultados;

window.onload = () => {
	document
		.getElementById("modificar_datos")
		.addEventListener("click", modificar_datos);

	document
		.getElementById("cargar_datos_xml")
		.addEventListener("click", cargar_datos_xml);

	document
		.getElementById("cargar_datos_fetch")
		.addEventListener("click", cargar_datos_fetch);

	resultados = document.getElementById("resultados");
};

function modificar_datos() {
	console.log("modificar_datos");
	let nombre_comunidad = document.getElementById("select_comunidades").value;

	let inputs = document.querySelectorAll("input");
	console.log(inputs);

	let comunidad_json = {
		ccaa: nombre_comunidad,
		dosisEntregadas: document.getElementById("dosis_entregadas").value,
		dosisAdministradas: document.getElementById("dosis_administradas").value,
		dosisPautaCompletada: document.getElementById("dosis_pautacompletas").value,
		porcentajeEntregadas: document.getElementById("por_entregadas").value,
		porcentajePoblacionAdministradas: document.getElementById(
			"por_poblacion_admin"
		).value,
		porcentajePoblacionCompletas: document.getElementById(
			"por_poblacion_completa"
		).value,
	};
	console.log(comunidad_json);

	fetch("actualizar_comunidad.php", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(comunidad_json),
	})
		.then((response) => {
			if (response.ok) return response.json();
		})
		.then((comunidad_modificada) => {
			resultados.innerHTML = "Modificamos datos";
			console.log(comunidad_modificada);
			console.log(comunidades_json);
			// Actualizar comunidades_json
			comunidades_json.forEach((comunidad) => {
				if (comunidad.ccaa == comunidad_modificada.ccaa) {
					comunidad.dosisEntregadas = comunidad_modificada.dosisEntregadas;
					comunidad.dosisAdministradas =
						comunidad_modificada.dosisAdministradas;
					comunidad.dosisPautaCompletada =
						comunidad_modificada.dosisPautaCompletada;
					comunidad.porcentajeEntregadas =
						comunidad_modificada.porcentajeEntregadas;
					comunidad.porcentajePoblacionAdministradas =
						comunidad_modificada.porcentajePoblacionAdministradas;
					comunidad.porcentajePoblacionCompletas =
						comunidad_modificada.porcentajePoblacionCompletas;
				}
			});
			construir_tabla(comunidades_json);
		});
}

function cargar_datos_fetch() {
	console.log("cargar_datos_fetch");
	fetch("latest.json")
		.then((response) => {
			if (response.ok) return response.json();
		})
		.then((comunidades) => {
			resultados.innerHTML = "Datos desde fetch cargados";
			console.log(comunidades);
			insertar_comunidades_xmlhttprq(filtrar_campos(comunidades));
		});
}

function cargar_datos_xml() {
	console.log("cargar_datos_xml");

	if (XMLHttpRequest) {
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = comprobar;
		xhr.open("GET", "latest.json");
		xhr.send();
	}
}

function comprobar() {
	console.log("comprobar");
	if (xhr.readyState === READY_STATE_COMPLETE && xhr.status === 200) {
		resultados.innerHTML = "Datos desde XML cargados";
		console.log("comprobar ok");
		console.log(JSON.parse(xhr.responseText));
		let comunidades = JSON.parse(xhr.responseText);

		// Lo hemos hecho de las dos maneras posibles. En el ejercicio no haría falta. Sólo una sería suficiente
		// insertar_comunidades_fetch(comunidades_json);
		insertar_comunidades_xmlhttprq(filtrar_campos(comunidades));
	}
}

function filtrar_campos(comunidades) {
	comunidades_json = [];
	comunidades.forEach((comunidad) => {
		if (comunidad.ccaa !== "Totales") {
			let comunidad_json = {
				ccaa: comunidad.ccaa,
				dosisEntregadas: comunidad.dosisEntregadas,
				dosisAdministradas: comunidad.dosisAdministradas,
				dosisPautaCompletada: comunidad.dosisPautaCompletada,
				porcentajeEntregadas: comunidad.porcentajeEntregadas,
				porcentajePoblacionAdministradas:
					comunidad.porcentajePoblacionAdministradas,
				porcentajePoblacionCompletas: comunidad.porcentajePoblacionCompletas,
			};
			comunidades_json.push(comunidad_json);
		}
	});
	console.log(comunidades_json);
	return comunidades_json;
}

function insertar_comunidades_fetch(comunidades) {
	console.log("insertar_comunidades_fetch");
	// Lo hacemos primero con Fetch, luego con XMLHttpRequest. No haría falta según el enunciado, solamente con uno de ellos.
	fetch("insertar_comunidades.php", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(comunidades),
	})
		.then((response) => {
			if (response.ok) return response.json();
		})
		.then((data) => {
			resultados.innerHTML = "Comunidad actualizada";
			console.log(data);
			comunidades_json = data;
			construir_tabla(data);
		});
}

function insertar_comunidades_xmlhttprq(comunidades) {
	console.log("insertar_comunidades_xmlhttprq");
	// Lo hacemos con  XMLHttpRequest. No haría falta según el enunciado, solamente con uno de ellos.

	xhr = new XMLHttpRequest();
	xhr.open("POST", "insertar_comunidades.php");
	xhr.setRequestHeader("Content-type", "application/json");
	let comunidades_json = JSON.stringify(comunidades);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === READY_STATE_COMPLETE && xhr.status === 200) {
			let ccaa_json = JSON.parse(xhr.responseText);
			console.log(ccaa_json);
			construir_tabla(ccaa_json);
		}
	};
	xhr.send(comunidades_json);
}

function construir_tabla(comunidades) {
	// Capturamos el elemento donde insertaremos la tabla
	let div_tabla = document.getElementById("tabla");
	div_tabla.innerHTML = "";

	// Primero la cabecera de la tabla
	let tabla = document.createElement("table");
	tabla.setAttribute("style", "border-collapse: collapse; text-align: center");
	let tr = document.createElement("tr");

	// Generamos los títulos de la cabecera
	let rotulos = [
		"Comunidad",
		"D, Entregadas",
		"D. Admin",
		"D. Completa",
		"%Entregadas",
		"%PobAdmin",
		"%PobCompleta",
	];

	rotulos.forEach((rotulo) => {
		let th = document.createElement("th");
		th.setAttribute("style", "border: solid 2px");
		th.appendChild(document.createTextNode(rotulo));
		tr.appendChild(th);
	});
	tabla.appendChild(tr);

	// Generamos los datos de la tabla
	comunidades.forEach((comunidad) => {
		// Generamos cada option de cada comunidad para añadirlos al select
		let option = document.createElement("option");
		option.setAttribute("value", comunidad.ccaa);
		option.appendChild(document.createTextNode(comunidad.ccaa));
		// option.innerText = comunidad.ccaa;   // Otra manera de hacer lo mismo
		let select = document.getElementById("select_comunidades");
		select.appendChild(option);

		let tr = document.createElement("tr");
		for (const item in comunidad) {
			let td = document.createElement("td");
			td.setAttribute("style", "border: solid 2px");
			td.appendChild(document.createTextNode(comunidad[item]));
			tr.appendChild(td);
		}

		tabla.appendChild(tr);
	});

	div_tabla.appendChild(tabla);
}
