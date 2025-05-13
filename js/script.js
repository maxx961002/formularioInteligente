// =============================
//    MOSTRAR FORMULARIOS
// =============================

function mostrarFormularioNuevo() {
  document.getElementById("formNuevo").style.display = "block";
  document.getElementById("formExistente").style.display = "none";
  document.getElementById("formReservaExistente").style.display = "none";

  // Asegura que se actualicen las opciones del select extra para nuevo cliente
  const unidadNueva = document.getElementById("unidad").value;
  const extraNueva = document.getElementById("extra");
  actualizarOpcionesExtra(unidadNueva, extraNueva);
}

function mostrarFormularioExistente() {
  document.getElementById("formExistente").style.display = "block";
  document.getElementById("formNuevo").style.display = "none";
  document.getElementById("formReservaExistente").style.display = "none";

  const unidadExistente = document.getElementById("unidadExistente").value;
  const extraExistente = document.getElementById("extraExistente");
  actualizarOpcionesExtra(unidadExistente, extraExistente);
}

4
let clienteEncontrado = null; // Variable global


// =============================
//         EVENTOS
// =============================

document.getElementById('botonPrimeraVez').addEventListener('click', mostrarFormularioNuevo);
document.getElementById('botonYaCliente').addEventListener('click', mostrarFormularioExistente);

document.getElementById("formularioNuevoCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  if (validarFormulario("nuevo")) {
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

document.getElementById("formularioReservaExistente").addEventListener("submit", function(e) {
  e.preventDefault();

  if (validarFormulario("existente")) {
    const datosReserva = {
      unidad: document.getElementById("unidadExistente").value.trim(),
      personas: document.getElementById("personasExistente").value.trim(),
      fechaIngreso: document.getElementById("fechaIngresoExistente").value,
      fechaEgreso: document.getElementById("fechaEgresoExistente").value,
      retiro: document.getElementById("retiroExistente").value.trim(),
      extra: document.getElementById("extraExistente").value.trim()
    };

    enviarDatosReservaExistente(datosReserva);
  }
});

// =============================
//     ENVIAR A GOOGLE SHEETS
// =============================

function enviarDatosFormulario(datos) {

  datos.fechaIngreso = convertirFechaA_ddmmaaaa(datos.fechaIngreso);
  datos.fechaEgreso = convertirFechaA_ddmmaaaa(datos.fechaEgreso);
  

  fetch('https://script.google.com/macros/s/AKfycbwwBQ6QrMJ_eaemOcy8JGWbxmzK5bHPmR5bTPUQ8XdCtsVQtzM9LvRH_7X3__SybmKyYQ/exec', {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify(datos)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok") {
        mostrarModalConfirmacion();
      }
       else {
        alert("❌ Error al enviar datos: " + data.mensaje);
      }
    })
    .catch(error => {
      alert("❌ Error de red al enviar datos: " + error);
    });
}

// =============================
// formatear fecha
// =============================

function convertirFechaA_ddmmaaaa(fechaIso) {
  if (!fechaIso || !fechaIso.includes("-")) return fechaIso;
  const [yyyy, mm, dd] = fechaIso.split("-");
  return `${dd}/${mm}/${yyyy}`;
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

  fetch('https://script.google.com/macros/s/AKfycbzJ4PEEjOUeFYr4KQTO2kK5v6eDyy-ovC7loXcUMnbWeXPZVQLYg1Fv_T97LnNdO8MUxg/exec')  
    .then(response => response.json())
    .then(clientes => {
      clienteEncontrado = clientes.find(cliente => cliente.dni === dniIngresado);

      if (clienteEncontrado) {
        // ✅ Si el cliente EXISTE
        document.getElementById("saludoCliente").innerText =
          `Hola ${clienteEncontrado.nombre}, nos alegra hospedarte nuevamente.`;

        document.getElementById("formReservaExistente").style.display = "block";

        // Acá después vamos a armar los campos para reservar directamente
      } else {
        mostrarModalNoEncontrado();
        reiniciarVista
      }
      
    })
    .catch(error => {
      console.error("Error al buscar el cliente:", error);
      alert("Hubo un problema buscando el cliente. Intenta nuevamente.");
    });
});

// =============================
//     ENVIAR RESERVA CLIENTE EXISTENTE
// =============================

// Enviar datos a la hoja de respuestas
function enviarDatosReservaExistente(datosReserva) {
  if (!clienteEncontrado) {
    alert("Error: No hay cliente cargado.");
    return;
  }

  datos.fechaIngreso = convertirFechaA_ddmmaaaa(datos.fechaIngreso);
  datos.fechaEgreso = convertirFechaA_ddmmaaaa(datos.fechaEgreso);
  
  const datosCompletos = {
    nombre: clienteEncontrado.nombre,
    localidad: clienteEncontrado.localidad,
    dni: clienteEncontrado.dni,
    telefono: clienteEncontrado.telefono,
    unidad: datosReserva.unidad,
    personas: datosReserva.personas,
    fechaIngreso: datosReserva.fechaIngreso,
    fechaEgreso: datosReserva.fechaEgreso,
    retiro: datosReserva.retiro,
    extra: datosReserva.extra
  };


  fetch('https://script.google.com/macros/s/AKfycbwwBQ6QrMJ_eaemOcy8JGWbxmzK5bHPmR5bTPUQ8XdCtsVQtzM9LvRH_7X3__SybmKyYQ/exec', {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify(datosCompletos)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "ok") {
      mostrarModalConfirmacion();
    }    
     else {
      alert("❌ Error al enviar la reserva: " + data.mensaje);
    }
  })
  .catch(error => {
    alert("❌ Error de red al enviar reserva: " + error);
  });
}

// =============================
//     OPCIONES EXTRAS
// =============================

function actualizarOpcionesExtra(unidadSeleccionada, selectExtra) {
  // Mostrar todas las opciones primero
  for (let i = 0; i < selectExtra.options.length; i++) {
    selectExtra.options[i].style.display = "block";
  }

  // Unidades que SÍ permiten camas separadas
  const unidadesConCamasSeparadas = [
    "Loft 2 personas",
    "Loft 3 y 4 personas",
    "Departamento 4 y 5 personas"
  ];

  // Si la unidad no está en la lista, ocultamos "Camas separadas"
  if (!unidadesConCamasSeparadas.includes(unidadSeleccionada)) {
    for (let i = 0; i < selectExtra.options.length; i++) {
      if (selectExtra.options[i].value === "Camas separadas") {
        selectExtra.options[i].style.display = "none";
      }
    }

    // También quitamos esa opción si ya estaba seleccionada
    if (selectExtra.value === "Camas separadas") {
      selectExtra.value = "";
    }
  }
}


// =============================
//   VALIDACIONES EN VIVO: NUEVO CLIENTE
// =============================

// Validar Nombre en vivo
document.getElementById("nombre").addEventListener("input", function() {
  if (this.value.trim().length < 3) {
    marcarError(this, "El nombre debe tener al menos 3 letras.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Localidad en vivo
document.getElementById("localidad").addEventListener("input", function() {
  if (this.value.trim() === "") {
    marcarError(this, "Debes ingresar la localidad.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar DNI en vivo
document.getElementById("dni").addEventListener("input", function() {
  if (isNaN(this.value.trim()) || this.value.trim().length < 7) {
    marcarError(this, "El DNI debe tener entre 7 y 9 dígitos.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Teléfono en vivo
document.getElementById("telefono").addEventListener("input", function() {
  if (isNaN(this.value.trim()) || this.value.trim().length < 10) {
    marcarError(this, "El teléfono debe tener al menos 10 dígitos.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Fecha Ingreso en vivo
document.getElementById("fechaIngreso").addEventListener("change", function() {
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const fechaIngreso = new Date(this.value + "T00:00:00");

  if (fechaIngreso < hoy) {
    marcarError(this, "La fecha de ingreso debe ser hoy o posterior.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Fecha Egreso en vivo
document.getElementById("fechaEgreso").addEventListener("change", function() {
  const fechaIngreso = new Date(document.getElementById("fechaIngreso").value + "T00:00:00");
  const fechaEgreso = new Date(this.value + "T00:00:00");

  if (fechaEgreso <= fechaIngreso) {
    marcarError(this, "La fecha de egreso debe ser posterior a la fecha de ingreso.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Personas según Unidad en vivo
document.getElementById("personas").addEventListener("input", function() {
  const unidad = document.getElementById("unidad").value;
  const valorPersonas = parseInt(this.value.trim());

  const limites = {
    "Loft 2 personas": [1, 2],
    "Loft 3 y 4 personas": [2, 4],
    "Cabaña 2 y 3 personas": [1, 3],
    "Departamento 4 y 5 personas": [2, 5],
    "Cabaña hasta 8 personas": [5, 8],
    "Habitación Sorelle": [1, 3]
  };

  const [min, max] = limites[unidad] || [1, 8];

  if (isNaN(valorPersonas) || valorPersonas < min || valorPersonas > max) {
    marcarError(this, `La unidad ${unidad} admite entre ${min} y ${max} personas.`);
  } else {
    marcarCorrecto(this);
  }
});

// Validar Unidad seleccionada cambia cantidad personas y opciones extra automáticamente
document.getElementById("unidad").addEventListener("change", function() {
  actualizarCantidadPersonas(); 
  actualizarOpcionesExtra(this.value, document.getElementById("extra")); // 👈 Aca le agregamos la lógica
});

// =============================
// VALIDACIONES EN VIVO: CLIENTE EXISTENTE
// =============================

// Validar Fecha Ingreso en vivo
document.getElementById("fechaIngresoExistente").addEventListener("change", function() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaIngreso = new Date(this.value + "T00:00:00");

  if (fechaIngreso < hoy) {
    marcarError(this, "La fecha de ingreso debe ser hoy o posterior.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Fecha Egreso en vivo
document.getElementById("fechaEgresoExistente").addEventListener("change", function() {
  const fechaIngreso = new Date(document.getElementById("fechaIngresoExistente").value + "T00:00:00");
  const fechaEgreso = new Date(this.value + "T00:00:00");

  if (fechaEgreso <= fechaIngreso) {
    marcarError(this, "La fecha de egreso debe ser posterior a la de ingreso.");
  } else {
    marcarCorrecto(this);
  }
});

// Validar Personas según Unidad en vivo (cliente existente)
document.getElementById("personasExistente").addEventListener("input", function() {
  const unidad = document.getElementById("unidadExistente").value;
  const valorPersonas = parseInt(this.value.trim());

  const limites = {
    "Loft 2 personas": [1, 2],
    "Loft 3 y 4 personas": [2, 4],
    "Cabaña 2 y 3 personas": [1, 3],
    "Departamento 4 y 5 personas": [2, 5],
    "Cabaña hasta 8 personas": [5, 8],
    "Habitación Sorelle": [1, 3]
  };

  const [min, max] = limites[unidad] || [1, 8];

  if (isNaN(valorPersonas) || valorPersonas < min || valorPersonas > max) {
    marcarError(this, `La unidad ${unidad} admite entre ${min} y ${max} personas.`);
  } else {
    marcarCorrecto(this);
  }
});

// Validar Unidad seleccionada cambia cantidad personas y opciones extra automáticamente
document.getElementById("unidadExistente").addEventListener("change", function() {
  actualizarOpcionesExtra(this.value, document.getElementById("extraExistente"));
});

// =============================
// VALIDACIONES GENERALES DEL FORMULARIO
// =============================

function validarFormulario(tipo) {
  let unidad, personas, fechaIngreso, fechaEgreso, retiro, extra;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (tipo === "nuevo") {
    const nombre = document.getElementById("nombre");
    const localidad = document.getElementById("localidad");
    const dni = document.getElementById("dni");
    const telefono = document.getElementById("telefono");

    if (!nombre.value.trim() || nombre.value.trim().length < 3) {
      marcarError(nombre, "El nombre debe tener al menos 3 letras.");
      return false;
    } else {
      marcarCorrecto(nombre);
    }

    if (!localidad.value.trim()) {
      marcarError(localidad, "Debes ingresar la localidad.");
      return false;
    } else {
      marcarCorrecto(localidad);
    }

    if (isNaN(dni.value.trim()) || dni.value.trim().length < 7) {
      marcarError(dni, "El DNI debe tener entre 7 y 9 dígitos.");
      return false;
    } else {
      marcarCorrecto(dni);
    }

    if (isNaN(telefono.value.trim()) || telefono.value.trim().length < 10) {
      marcarError(telefono, "El teléfono debe tener al menos 10 dígitos.");
      return false;
    } else {
      marcarCorrecto(telefono);
    }

    unidad = document.getElementById("unidad").value.trim();
    personas = parseInt(document.getElementById("personas").value.trim());
    fechaIngreso = new Date(document.getElementById("fechaIngreso").value + "T00:00:00");
    fechaEgreso = new Date(document.getElementById("fechaEgreso").value + "T00:00:00");
    retiro = document.getElementById("retiro").value.trim();
    extra = document.getElementById("extra").value.trim();
  }

  if (tipo === "existente") {
    unidad = document.getElementById("unidadExistente").value.trim();
    personas = parseInt(document.getElementById("personasExistente").value.trim());
    fechaIngreso = new Date(document.getElementById("fechaIngresoExistente").value + "T00:00:00");
    fechaEgreso = new Date(document.getElementById("fechaEgresoExistente").value + "T00:00:00");
    retiro = document.getElementById("retiroExistente").value.trim();
    extra = document.getElementById("extraExistente").value.trim();
  }

  if (!unidad) {
    alert("❌ Debes seleccionar una unidad.");
    return false;
  }

  const limites = {
    "Loft 2 personas": [1, 2],
    "Loft 3 y 4 personas": [2, 4],
    "Cabaña 2 y 3 personas": [1, 3],
    "Departamento 4 y 5 personas": [2, 5],
    "Cabaña hasta 8 personas": [5, 8],
    "Habitación Sorelle": [1, 3]
  };

  const [minPersonas, maxPersonas] = limites[unidad] || [1, 8];

  if (isNaN(personas) || personas < minPersonas || personas > maxPersonas) {
    alert(`❌ La unidad ${unidad} admite entre ${minPersonas} y ${maxPersonas} personas.`);
    return false;
  }

  if (isNaN(fechaIngreso) || fechaIngreso < hoy) {
    alert("❌ La fecha de ingreso debe ser hoy o una fecha futura.");
    return false;
  }

  if (isNaN(fechaEgreso) || fechaEgreso <= fechaIngreso) {
    alert("❌ La fecha de egreso debe ser posterior a la de ingreso.");
    return false;
  }

  if (!retiro) {
    alert("❌ Debes seleccionar un horario de salida.");
    return false;
  }

  if (!extra) {
    alert("❌ Debes seleccionar una opción en '¿Algo que debamos saber?'.");
    return false;
  }

  const unidadesConCamasSeparadas = [
    "Loft 2 personas",
    "Loft 3 y 4 personas",
    "Departamento 4 y 5 personas"
  ];

  if (extra === "Camas separadas" && !unidadesConCamasSeparadas.includes(unidad)) {
    alert(`❌ La unidad ${unidad} no permite la opción 'Camas separadas'.`);
    return false;
  }

  return true;
}

// =============================
//         MODALES
// =============================

function mostrarModalConfirmacion() {
  document.getElementById("modalConfirmacion").style.display = "flex";
}

function mostrarModalNoEncontrado() {
  document.getElementById("modalNoEncontrado").style.display = "flex";
}

document.getElementById("btnCerrarModal").addEventListener("click", () => {
  document.getElementById("modalConfirmacion").style.display = "none";
  reiniciarVista();
});

document.getElementById("btnAceptarNoEncontrado").addEventListener("click", () => {
  document.getElementById("modalNoEncontrado").style.display = "none";
  reiniciarVista();
});


// =============================
// FUNCIONES AUXILIARES
// =============================

function reiniciarVista() {
  document.getElementById("formNuevo").style.display = "none";
  document.getElementById("formExistente").style.display = "none";
  document.getElementById("formReservaExistente").style.display = "none";
  document.getElementById("saludoCliente").innerText = "";
  document.getElementById("dniExistente").value = "";
}

function marcarError(input, mensaje) {
  input.style.border = "2px solid red";
  const errorField = document.getElementById("error_" + input.id) || crearCampoError(input, "error_" + input.id);
  errorField.innerText = mensaje;
}

function marcarCorrecto(input) {
  input.style.border = "2px solid green";
  const errorField = document.getElementById("error_" + input.id);
  if (errorField) {
    errorField.innerText = "";
  }
}

function crearCampoError(inputElement, id) {
  const error = document.createElement("small");
  error.style.color = "red";
  error.id = id;
  error.style.display = "block";
  inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
  return error;
}

function actualizarCantidadPersonas() {
  const unidad = document.getElementById("unidad").value;
  const inputPersonas = document.getElementById("personas");

  const limites = {
    "Loft 2 personas": [1, 2],
    "Loft 3 y 4 personas": [2, 4],
    "Cabaña 2 y 3 personas": [1, 3],
    "Departamento 4 y 5 personas": [2, 5],
    "Cabaña hasta 8 personas": [5, 8],
    "Habitación Sorelle": [1, 3]
  };

  const [min, max] = limites[unidad] || [1, 8];
  inputPersonas.min = min;
  inputPersonas.max = max;
}


