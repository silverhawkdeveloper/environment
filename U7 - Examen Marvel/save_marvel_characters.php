<?php
header("Content-Type: application/json; charset=UTF-8");

define('DB_SERVER', 'mariadb');
define('DB_USERNAME', 'dwec');
define('DB_PASSWORD', 'dwec');
define('DB_NAME', 'dwec');

$conexion = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
$conexion->set_charset("utf8");

if ($conexion->connect_error) {
  $error = "Error en la conexion : "  . $conexion->connect_error;
  echo json_encode($error);
  exit(1);
}

$id = $name = $modified = $path = "";

$error = "";

// Procesar datros cuando se realiza la petición
if (($request = file_get_contents('php://input')) && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $personajes = json_decode($request, false);

  foreach ($personajes as $personaje) {

    // Validar character id
    if (property_exists($personaje, 'id') && isset($personaje->id) && !empty(trim($personaje->id))) {
      $id = trim($personaje->id);
    } else {
      $error = $error . "Character ID not found.";
    }

    // Validar character name
    if (property_exists($personaje, 'name') && isset($personaje->name) && !empty(trim($personaje->name))) {
      $name = trim($personaje->name);
    } else {
      $error = $error . "Character name not found. ";
    }

    // Validar character modified
    if (property_exists($personaje, 'modified') && isset($personaje->modified) && !empty(trim($personaje->modified))) {
      $modified = trim($personaje->modified);
    } else {
      $error = $error . "Character modified not found. ";
    }

    // Validar character path
    if (property_exists($personaje, 'path') && isset($personaje->path) && !empty(trim($personaje->path))) {
      $path = trim($personaje->path);
    } else {
      $error = $error . "Character image path not found. ";
    }

    // Si no hay errores, procedemos a insertar en la BD
    if (empty($error)) {
      // Preparar la sentencia
      $sql = "REPLACE INTO `marvel_characters` (`id`,`name`, `modified`, `path`) VALUES (?,?,?,?)";

      if ($stmt = $conexion->prepare($sql)) {
        // Enlaza las variables a los parámetros
        $stmt->bind_param(
          'ssss',
          $param_id,
          $param_name,
          $param_modified,
          $param_path,

        );

        // Establecer los parámetros
        $param_id = $id;
        $param_name = $name;
        $param_modified = $modified;
        $param_path = $path;

        // Ejecutar la sentencia
        if (!$stmt->execute()) {
          // Ha habido algún error. Devolver json con error de insercion en BD
          $error = array('resultado' => "Error inserting into DB. ");
          echo json_encode($error);
          exit(1);
        }
      } else {
        $error = array('resultado' => "Error preparing SQL statement.");
        echo json_encode($error);
        exit(1);
      }
      // Cerramos la sentencia y la conexion
      mysqli_stmt_close($stmt);
    } else {
      $error = array('resultado' => $error);
      echo json_encode($error);
      exit(1);
    }
  }

  // Se han ejecutado todas las inserciones correctamente

  // Se ha creado corretamente, devolver json con "ok"
  $sql = "SELECT `id`, `name`, `modified`, `path` FROM `marvel_characters`";

  $resultado = $conexion->query($sql);

  $salida = array();

  if ($resultado && $resultado->num_rows > 0) {
    $salida =  $$error = array('resultado' => "Characters saved properly. ");
  }

  echo json_encode($salida);
  exit(1);
} else {
  $error = array('resultado' => "Not a POST request.");
  echo json_encode($error);
}
