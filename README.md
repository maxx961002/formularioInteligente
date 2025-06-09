# Formulario Inteligente Complejo La Yema 🏡

Bienvenido al **Formulario Inteligente** del **Complejo La Yema**, un complejo de cabañas, departamentos, habitaciones y loft ubicado en Miramar, Córdoba, Argentina.

## 📋 Descripción

Este proyecto tiene como objetivo optimizar y profesionalizar el proceso de **reservas** y la **gestión de clientes** en el Complejo La Yema. 

Anteriormente, la toma de reservas se hacía manual. Con el paso del tiempo la hice que sea a través de un Google Form, que obligaba a los clientes frecuentes a cargar sus datos cada vez, provocando duplicaciones en la base y errores manuales con fechas, cantidad de personas y pedidos extras.

Con este nuevo sistema:
- Los **clientes nuevos** pueden registrarse con sus datos.
- Los **clientes existentes** pueden buscar su DNI y reservar **sin volver a cargar su información**.
- Se realizan **validaciones en tiempo real** para evitar errores en la carga de datos.
- El formulario está pensado **exclusivamente para mobile**, adaptado a nuestro cliente ideal que reserva desde su celular.

Este flujo de trabajo más ágil mejora la experiencia del cliente y la gestión interna.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** + **CSS3**: Estructura y estilo del formulario.
- **JavaScript**: Lógica de interactividad y validaciones.
- **SweetAlert2**: Librería para alertas modales elegantes.
- **Google Sheets** + **Google Apps Script**: Backend de almacenamiento y automatización.
- **Mobile First Design**: Enfoque exclusivo para usuarios móviles.

---

## 🔗 Conexión con Google Sheets y Apps Script

- **Clientes**: Los datos de nuevos clientes se registran en una hoja de clientes.
- **Reservas**: Cada reserva genera un evento en **Google Calendar**, asignándole una unidad y un ID único.
- **Control**:
  - Ingresos mensuales, ganancias y ocupación (gráficos dinámicos).
  - Control de **TOP clientes** por cantidad de visitas.
  - **Cancelaciones**: Se eliminan eventos del calendario automáticamente.
  - **Reprogramaciones**: Movemos las reservas a una hoja especial para confirmarlas más adelante.
  - **Tarifas**: Tabla dinámica con precios diferenciados por temporadas y cálculos automáticos de saldo después de señas.

Toda esta automatización permite administrar el complejo **de manera remota**, sin errores de carga y sin intervención manual. Solo se deben de validar datos para que segun la seleccion realice la accion de automatizacion.

---

## 📲 Instrucciones de Uso

1. El usuario accede al formulario (link enviado por WhatsApp).
2. Puede elegir entre:
   - **Primera vez**: Carga todos sus datos y reserva.
   - **Ya soy cliente**: Busca su DNI, verifica sus datos y realiza la reserva rápidamente.
3. Validaciones en tiempo real evitan errores comunes como:
   - Fechas inválidas.
   - Cantidad de personas según la unidad seleccionada.
   - Formato de teléfono y DNI.
4. Una vez enviada la reserva:
   - El cliente recibe un mensaje de confirmación.
   - Los datos son procesados en Google Sheets y Google Calendar automáticamente.

---

## 🚀 Funcionalidades Destacadas

- Validaciones en vivo de todos los campos del formulario.
- Modalidad **mobile first** para facilitar la reserva desde smartphones.
- Automatización completa con Google Sheets y Calendar:
  - Asignación de unidades.
  - Generación de eventos.
  - Cálculo automático de precios.
  - Seguimiento de clientes y estadísticas de ocupación e ingresos.

---

## 👤 Autor

Maximiliano Irazoque

---

## 📌 Notas

Este Proyecto me ayuda en mi trabajo diario permitiendome tomar reservas desde cualquier lado sin la necesidad de estar en la oficina revisando disponibilidades... Ademas este proyecto forma parte de la entrega final para el curso de desarrollo en JavaScript, donde se solicitaba crear un simulador interactivo usando JavaScript y librerías externas.

