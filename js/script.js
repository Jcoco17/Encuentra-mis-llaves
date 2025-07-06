
const datos = {
  "001": {
    nombre: "Juan Pérez",
    telefono: "+50612345678",
    descripcion: "Llaves de la casa",
    notas: "Tiene copia extra"
  },
  "I02": {
    nombre: "María López",
    telefono: "+50698765432",
    descripcion: "Llaves del coche",
    notas: "Entregar en oficina"
  },
  "LX4": {
    nombre: "José Luis Monge",
    telefono: "+50661295951",
    descripcion: "Llaves principales de la casa",
    notas: "Ojochal de osa, enviar mensaje si las encuentran"
  },
  "LC3": {
    nombre: "Carlos Gómez",
    telefono: "+50655551234",
    descripcion: "Llaves del almacén",
    notas: "Solo para emergencia"
  }
};

// Función para obtener parámetros en la URL
function getParametro(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

// Guardar en historial en localStorage
function guardarEnHistorial(codigo) {
  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  if (!historial.includes(codigo)) {
    historial.push(codigo);
    localStorage.setItem('historial', JSON.stringify(historial));
  }
}

// Mostrar historial
function mostrarHistorial() {
  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  const divHistorial = document.getElementById('historial');
  if (!divHistorial) return;
  if (historial.length === 0) {
    divHistorial.innerHTML = "<p>No hay historial de consultas.</p>";
  } else {
    divHistorial.innerHTML = "<p>Historial de códigos consultados:</p><ul>" + 
      historial.map(c => `<li>${c}</li>`).join('') + "</ul>";
  }
}

// Mostrar política de privacidad
function mostrarPolitica() {
  document.getElementById('politica').style.display='block';
  document.getElementById('overlay').style.display='block';
}

// Cerrar política de privacidad
function cerrarPolitica() {
  document.getElementById('politica').style.display='none';
  document.getElementById('overlay').style.display='none';
}

// Cargar al abrir
window.onload = function() {
  const codigoDesdeURL = getParametro('codigo');
  if (codigoDesdeURL) {
    document.getElementById('codigo').value = codigoDesdeURL;
    mostrarInformacion();
  }
  mostrarHistorial();
};

// Función para mostrar información del código ingresado
function mostrarInformacion() {
  const valor = document.getElementById('codigo').value.trim();
  if (valor === "") {
    document.getElementById('mensaje').innerText = "Por favor, ingresa un código.";
    document.getElementById('resultado').innerHTML = "";
    return;
  }
  document.getElementById('mensaje').innerText = "";
  document.getElementById('loading').innerText = "Cargando...";

  setTimeout(function() {
    document.getElementById('loading').innerText = "";
    const codigo = valor.toUpperCase();
    const info = datos[codigo];
    const divResultado = document.getElementById('resultado');

    if (info) {
      const numeroWhatsApp = info.telefono.replace(/\D/g, '');
      divResultado.innerHTML = `
        <h3>Información del código: ${codigo}</h3>
        <p><strong>Nombre:</strong> ${info.nombre}</p>
        <p><strong>Teléfono:</strong> <a href="tel:${info.telefono}">${info.telefono}</a></p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent('Hola ' + info.nombre + ', he encontrado tus llaves por medio del código QR. ¿Podría ponerme en contacto contigo para devolverlas?')}" target="_blank"><i class="fab fa-whatsapp"></i> Enviar WhatsApp</a></p>
        <p><strong>Descripción:</strong> ${info.descripcion}</p>
        <p><strong>Notas:</strong> ${info.notas}</p>
      `;
    } else {
      divResultado.innerHTML = "<p style='color: red; font-size:1.2em;'>Código no encontrado.</p>";
    }

    // Guardar en historial y mostrar
    guardarEnHistorial(codigo);
    mostrarHistorial();

  }, 500);
}

// Función para limpiar campos y resultados
function limpiar() {
  document.getElementById('codigo').value = "";
  document.getElementById('resultado').innerHTML = "";
  document.getElementById('mensaje').innerText = "";
  document.getElementById('loading').innerText = "";
}
