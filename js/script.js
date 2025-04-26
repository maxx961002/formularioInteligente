// =============================
//    MOSTRAR FORMULARIOS
// =============================

function mostrarFormularioNuevo() {
  document.getElementById("formNuevo").style.display = "block";
  document.getElementById("formExistente").style.display = "none";
}

function mostrarFormularioExistente() {
  document.getElementById("formExistente").style.display = "block";
  document.getElementById("formNuevo").style.display = "none";
}

// =============================
//         EVENTOS
// =============================

document.getElementById('botonPrimeraVez').addEventListener('click', mostrarFormularioNuevo);
document.getElementById('botonYaCliente').addEventListener('click', mostrarFormularioExistente);

document.getElementById("formularioNuevoCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  if (validarFormulario()) {
    const datos = {
      nombre: document.getElementById("nombre").value.trim(),
      localidad: document.getElementById("localidad").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      personas: document.getElementById("personas").value.trim(),
      unidad: document.getElementById("unidad").value.trim(),
      fechaIngreso: document.getElementById("fechaIngreso").value,
      fechaEgreso: document.getElementById("fechaEgreso").value,
      retiro: document.getElementById("retiro").value.trim(),
      extra: document.getElementById("extra").value.trim()
    };

    enviarDatosFormulario(datos);
  }
});

// =============================
//     ENVIAR A GOOGLE SHEETS
// =============================

function enviarDatosFormulario(datos) {
  fetch('https://script.google.com/macros/s/AKfycbwwBQ6QrMJ_eaemOcy8JGWbxmzK5bHPmR5bTPUQ8XdCtsVQtzM9LvRH_7X3__SybmKyYQ/exec', {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify(datos)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok") {
        alert("✅ ¡Datos enviados correctamente! Te estaremos confirmando por WhatsApp.");
        document.getElementById("formularioNuevoCliente").reset();
      } else {
        alert("❌ Error al enviar datos: " + data.mensaje);
      }
    })
    .catch(error => {
      alert("❌ Error de red al enviar datos: " + error);
    });
}

// =============================
//    VALIDACIONES EN VIVO
// =============================

// Auxiliar para crear campos de error
function crearCampoError(inputElement, id) {
  const error = document.createElement("small");
  error.style.color = "red";
  error.id = id;
  inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
  return error;
}

// Validar cantidad de personas en vivo
document.getElementById("unidad").addEventListener("change", actualizarCantidadPersonas);
document.getElementById("unidad").addEventListener("change", actualizarOpcionesExtra);
document.getElementById("personas").addEventListener("input", validarCantidadPersonas);
document.getElementById("dni").addEventListener("input", validarDNI);
document.getElementById("telefono").addEventListener("input", validarTelefono);
document.getElementById("fechaIngreso").addEventListener("change", validarFechaIngreso);
document.getElementById("fechaEgreso").addEventListener("change", validarFechaEgreso);

// Actualizar cantidad personas según unidad
function actualizarCantidadPersonas() {
  const unidadSeleccionada = document.getElementById("unidad").value;
  const inputPersonas = document.getElementById("personas");

  let minPersonas = 1;
  let maxPersonas = 8;

  switch (unidadSeleccionada) {
    case "Loft 2 personas": minPersonas = 1; maxPersonas = 2; break;
    case "Loft 3 y 4 personas": minPersonas = 3; maxPersonas = 4; break;
    case "Cabaña 2 y 3 personas": minPersonas = 1; maxPersonas = 3; break;
    case "Departamento 4 y 5 personas": minPersonas = 2; maxPersonas = 5; break;
    case "Cabaña hasta 8 personas": minPersonas = 5; maxPersonas = 8; break;
    case "Habitación Sorelle": minPersonas = 1; maxPersonas = 3; break;
  }

  inputPersonas.min = minPersonas;
  inputPersonas.max = maxPersonas;
}

// Validar cantidad de personas
function validarCantidadPersonas() {
  const unidad = document.getElementById("unidad").value;
  const personas = parseInt(document.getElementById("personas").value);
  const inputPersonas = document.getElementById("personas");
  const errorField = document.getElementById("errorPersonas") || crearCampoError(inputPersonas, "errorPersonas");

  let min = 1;
  let max = 8;

  switch (unidad) {
    case "Loft 2 personas": min = 1; max = 2; break;
    case "Loft 3 y 4 personas": min = 3; max = 4; break;
    case "Cabaña 2 y 3 personas": min = 1; max = 3; break;
    case "Departamento 4 y 5 personas": min = 2; max = 5; break;
    case "Cabaña hasta 8 personas": min = 5; max = 8; break;
    case "Habitación Sorelle": min = 1; max = 3; break;
  }

  if (isNaN(personas) || personas < min || personas > max) {
    inputPersonas.style.border = "2px solid red";
    errorField.innerText = `La unidad ${unidad} admite entre ${min} y ${max} personas.`;
  } else {
    inputPersonas.style.border = "2px solid green";
    errorField.innerText = "";
  }
}

// Validar DNI en vivo
function validarDNI() {
  const inputDni = document.getElementById("dni");
  const dni = inputDni.value.trim();
  const errorField = document.getElementById("errorDNI") || crearCampoError(inputDni, "errorDNI");

  if (dni.length < 7 || dni.length > 9) {
    inputDni.style.border = "2px solid red";
    errorField.innerText = "El DNI debe tener entre 7 y 9 dígitos.";
  } else {
    inputDni.style.border = "2px solid green";
    errorField.innerText = "";
  }
}
// VALIDAR TELEFONO EN VIVO//

document.getElementById("paisCodigo").addEventListener("change", function () {
  const select = document.getElementById("paisCodigo");
  const inputCodigo = document.getElementById("codigoPersonalizado");

  if (select.value === "otro") {
    inputCodigo.style.display = "inline-block";
    inputCodigo.required = true;
  } else {
    inputCodigo.style.display = "none";
    inputCodigo.required = false;
    inputCodigo.value = "";
  }
});

// EVENTO PARA ENVIAR FORMULARIO
document.getElementById("formularioNuevoCliente").addEventListener("submit", function (e) {})

// Validar Teléfono en vivo
function validarTelefono() {
  const inputTel = document.getElementById("telefono");
  const tel = inputTel.value.trim();
  const errorField = document.getElementById("errorTelefono") || crearCampoError(inputTel, "errorTelefono");

  if (tel.length < 10) {
    inputTel.style.border = "2px solid red";
    errorField.innerText = "El teléfono debe tener al menos 10 dígitos.";
  } else {
    inputTel.style.border = "2px solid green";
    errorField.innerText = "";
  }
}

// Validar Fecha Ingreso
function validarFechaIngreso() {
  const inputIngreso = document.getElementById("fechaIngreso");
  const fechaIngreso = new Date(inputIngreso.value + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const errorField = document.getElementById("errorFechaIngreso") || crearCampoError(inputIngreso, "errorFechaIngreso");

  if (fechaIngreso < hoy) {
    inputIngreso.style.border = "2px solid red";
    errorField.innerText = "La fecha de ingreso debe ser hoy o posterior.";
  } else {
    inputIngreso.style.border = "2px solid green";
    errorField.innerText = "";
  }
}

// Validar Fecha Egreso
function validarFechaEgreso() {
  const inputIngreso = document.getElementById("fechaIngreso");
  const inputEgreso = document.getElementById("fechaEgreso");

  const fechaIngreso = new Date(inputIngreso.value + "T00:00:00");
  const fechaEgreso = new Date(inputEgreso.value + "T00:00:00");

  const errorField = document.getElementById("errorFechaEgreso") || crearCampoError(inputEgreso, "errorFechaEgreso");

  if (fechaEgreso <= fechaIngreso) {
    inputEgreso.style.border = "2px solid red";
    errorField.innerText = "La fecha de egreso debe ser posterior a la de ingreso.";
  } else {
    inputEgreso.style.border = "2px solid green";
    errorField.innerText = "";
  }
}
// =============================
//     FORMULARIO CLIENTES
// =============================

document.getElementById("btnBuscar").addEventListener("click", function () {
  const dniIngresado = document.getElementById("dniExistente").value.trim();

  if (!dniIngresado) {
    alert("❌ Debes ingresar un DNI para buscar.");
    return;
  }

  fetch('https://script.google.com/macros/s/AKfycbwwBQ6QrMJ_eaemOcy8JGWbxmzK5bHPmR5bTPUQ8XdCtsVQtzM9LvRH_7X3__SybmKyYQ/exec')  // 🔥 URL de la WebApp que creamos recién
    .then(response => response.json())
    .then(clientes => {
      const clienteEncontrado = clientes.find(cliente => cliente.dni === dniIngresado);

      if (clienteEncontrado) {
        // ✅ Si el cliente EXISTE
        document.getElementById("saludoCliente").innerText =
          `Hola ${clienteEncontrado.nombre}, nos alegra hospedarte nuevamente.`;

        document.getElementById("formReservaExistente").style.display = "block";
        document.getElementById("formCompletoDesdeExistente").style.display = "none";

        // Acá después vamos a armar los campos para reservar directamente
      } else {
        // ❌ Si NO existe
        alert("No encontramos tu DNI. Te registraremos como nuevo cliente.");
        document.getElementById("formCompletoDesdeExistente").style.display = "block";
        document.getElementById("formReservaExistente").style.display = "none";
      }
    })
    .catch(error => {
      console.error("Error al buscar el cliente:", error);
      alert("Hubo un problema buscando el cliente. Intenta nuevamente.");
    });
});


// =============================
//     OPCIONES EXTRAS
// =============================

function actualizarOpcionesExtra() {
  const unidadSeleccionada = document.getElementById("unidad").value;
  const selectExtra = document.getElementById("extra");

  for (let i = 0; i < selectExtra.options.length; i++) {
    selectExtra.options[i].style.display = "block";
  }

  const unidadesConCamasSeparadas = [
    "Loft 2 personas",
    "Loft 3 y 4 personas",
    "Departamento 4 y 5 personas"
  ];

  if (!unidadesConCamasSeparadas.includes(unidadSeleccionada)) {
    for (let i = 0; i < selectExtra.options.length; i++) {
      if (selectExtra.options[i].value === "Camas separadas") {
        selectExtra.options[i].style.display = "none";
      }
    }
    if (selectExtra.value === "Camas separadas") {
      selectExtra.value = "";
    }
  }
}

// =============================
//   VALIDAR TODO AL ENVIAR
// =============================

function validarFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const unidad = document.getElementById("unidad").value.trim();
  const personas = parseInt(document.getElementById("personas").value.trim());
  const fechaIngreso = new Date(document.getElementById("fechaIngreso").value + "T00:00:00");
  const fechaEgreso = new Date(document.getElementById("fechaEgreso").value + "T00:00:00");
  const retiro = document.getElementById("retiro").value.trim();
  const extra = document.getElementById("extra").value.trim();
  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  if (!nombre || nombre.length < 3) {
    alert("❌ Nombre inválido.");
    return false;
  }
  if (!localidad) {
    alert("❌ Localidad inválida.");
    return false;
  }
  if (isNaN(dni) || dni.length < 7) {
    alert("❌ DNI inválido.");
    return false;
  }
  if (isNaN(telefono) || telefono.length < 10) {
    alert("❌ Teléfono inválido.");
    return false;
  }
  if (!unidad) {
    alert("❌ Debes seleccionar una unidad.");
    return false;
  }
  if (isNaN(personas) || personas <= 0) {
    alert("❌ Cantidad de personas inválida.");
    return false;
  }
  if (isNaN(fechaIngreso) || fechaIngreso < hoy) {
    alert("❌ La fecha de ingreso debe ser hoy o una fecha futura.");
    return false;
  }
  if (isNaN(fechaEgreso) || fechaEgreso <= fechaIngreso) {
    alert("❌ La fecha de egreso debe ser posterior a la fecha de ingreso.");
    return false;
  }
  if (!retiro) {
    alert("❌ Debes seleccionar horario de salida.");
    return false;
  }
  if (!extra) {
    alert("❌ Debes seleccionar 'algo que debamos saber'.");
    return false;
  }

  return true;
}
