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

$name = $description = $class = "";

$error = "";

// Procesar datros cuando se realiza la petición
if (($request = file_get_contents('php://input')) && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($request, false);

  // Validar uid
  if (property_exists($data, 'uid') && isset($data->uid) && !empty(trim($data->uid))) {
    $uid = trim($data->uid);
  } else {
    $error = $error . "Insert UID of the criminal. ";
  }

  // Validar title
  if (property_exists($data, 'title') && isset($data->title) && !empty(trim($data->title))) {
    $title = trim($data->title);
  } else {
    $error = $error . "Insert title of the criminal. ";
  }

  // Validar description
  if (property_exists($data, 'description') && isset($data->description) && !empty(trim($data->description))) {
    $description = trim($data->description);
  } else {
    $error = $error . "Insert description of the criminal. ";
  }

  // Validar aliases
  if (property_exists($data, 'aliases') && isset($data->aliases) && !empty($data->aliases)) {
    $aliases = implode(";", $data->aliases);
  } else {
    $aliases = "";
  }

  // Validar images
  if (property_exists($data, 'images') && isset($data->images) && !empty(trim($data->images))) {
    $images = trim($data->images);
  } else {
    $error = $error . "Insert images of the criminal. ";
  }

  // Si no hay errores, procedemos a insertar en la BD
  if (empty($error)) {
    // Preparar la sentencia
    $sql = "REPLACE INTO `criminals` (`uid`,`title`, `description`,`aliases`, `images`) VALUES (?,?,?,?,?)";

    if ($stmt = $conexion->prepare($sql)) {
      // Enlaza las variables a los parámetros
      $stmt->bind_param(
        'sssss',
        $param_uid,
        $param_title,
        $param_description,
        $param_aliases,
        $param_images,
      );

      // Establecer los parámetros
      $param_uid = $uid;
      $param_title = $title;
      $param_description = $description;
      $param_aliases = $aliases;
      $param_images = $images;

      // Ejecutar la sentencia
      if (!$stmt->execute()) {
        // Ha habido algún error. Devolver json con error de insercion en BD
        $error = array('result' => "Error adding criminal. ");
        echo json_encode($error);
        exit(1);
      }
    } else {
      $error = array('result' => "Error preparing SQL statement. ");
      echo json_encode($error);
      exit(1);
    }
    // Cerramos la sentencia y la conexion
    mysqli_stmt_close($stmt);
  } else {
    $error = array('result' => $error);
    echo json_encode($error);
    exit(1);
  }


  // Se han ejecutado todas las inserciones correctamente

  // Se ha creado corretamente, devolver json con el resultado
  $sql = "SELECT `uid`, `title`, `description`, `aliases`, `images` FROM `criminals`";

  $resultado = $conexion->query($sql);

  $salida = array();

  if ($resultado && $resultado->num_rows > 0) {
    $salida =  $$error = array('result' => "Criminal inserted properly. ");
  }

  echo json_encode($salida);
  exit(1);
} else {
  $error = array('result' => "It's not a POST request. ");
  echo json_encode($error);
}
