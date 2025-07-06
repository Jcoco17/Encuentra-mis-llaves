

// Función para generar N códigos QR en la página
function generarCodigos(cantidad) {
  const contenedor = document.getElementById('codigos');
  contenedor.innerHTML = ''; // limpiar
  for (let i=0; i<cantidad; i++) {
    const codigo = 'CODE' + Date.now() + '-' + i;
    crearCodigo(codigo);
  }
}

function crearCodigo(codigo) {
  const div = document.createElement('div');
  div.className = 'codigo';
  div.innerHTML = `
    <p><strong>Código:</strong> ${codigo}</p>
    <canvas id="qrcode-${codigo}"></canvas>
  `;
  document.getElementById('codigos').appendChild(div);
  QRCode.toCanvas(document.getElementById(`qrcode-${codigo}`), codigo, { width: 180 });
}

// Función para registrar datos del cliente (ejemplo)
function registrarCliente(codigo, nombre, telefono) {
  // Aquí deberías integrar con Firebase o tu backend
  alert(`Registrado: ${codigo} | ${nombre} | ${telefono}`);
}
