document.getElementById("formularioNuevoCliente").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que se envíe automáticamente
  
    // Llamamos a la función que valida todos los campos
    if (validarFormulario()) {
      alert("✅ ¡Formulario enviado correctamente!");
      // Acá después hacemos el envío real a Sheets
    }
  });
  