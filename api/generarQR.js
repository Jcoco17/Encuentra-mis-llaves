import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { cantidad, orderID } = req.body;

  // Aquí debes verificar el pago con PayPal API
  const pagoValido = await verificarPagoPayPal(orderID);
  if (!pagoValido) {
    res.status(400).json({ error: 'Pago no verificado' });
    return;
  }

  const doc = new PDFDocument({ autoFirstPage: false });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=codigos.pdf');
    res.send(pdfBuffer);
  });

  for (let i = 0; i < cantidad; i++) {
    const codigo = CODE-${Date.now()}-${i};
    const url = https://encuentra-mis-llaves.vercel.app//?codigo=${encodeURIComponent(codigo)};
    const qrDataUrl = await QRCode.toDataURL(url);
    const qrImageBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // Añadir página y QR
    doc.addPage({ size: 'A4', layout: 'landscape' });
    doc.image(qrImageBuffer, 40, 40, { width: 300 });
    doc.fontSize(12).text(codigo, 50, 400);
  }

  // Finaliza el PDF
  doc.end();
}

// Función simulada, reemplázala por la verificación real con PayPal
async function verificarPagoPayPal(orderID) {9R9F5U4EYLBJQ
  // Aquí debes llamar a PayPal API para verificar el pago
  // Para el ejemplo, asumimos que siempre es válido
  return true;
}