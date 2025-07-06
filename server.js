
const axios = require('axios');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PAYPAL_CLIENT_ID = 'TU_CLIENT_ID'; // Reemplaza
const PAYPAL_SECRET = 'TU_SECRET'; // Reemplaza
let accessToken = '';

// Función para obtener token de PayPal
async function getPayPalAccessToken() {
  const res = await axios.post('https://api.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET
    }
  });
  accessToken = res.data.access_token;
  return accessToken;
}

// Verificar pago con PayPal
async function verificarPago(orderID) {
  if(!accessToken) await getPayPalAccessToken();
  const res = await axios.get(`https://api.paypal.com/v2/checkout/orders/${orderID}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return res.data.status === 'COMPLETED' || res.data.status === 'APPROVED';
}

// Endpoint para generar códigos tras pago
app.post('/generar-codigos', async (req, res) => {
  const { orderID, cantidad } = req.body;
  try {
    const pagado = await verificarPago(orderID);
    if(!pagado) {
      return res.json({ success: false, message: 'Pago no verificado' });
    }

    // Generar los códigos y sus QR
    const codigos = [];
    const pdfDocs = new PDFDocument({ autoFirstPage: false });
    const chunks = [];
    pdfDocs.on('data', chunk => chunks.push(chunk));
    pdfDocs.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      const base64PDF = pdfBuffer.toString('base64');
      const htmlPDF = `<a href="data:application/pdf;base64,${base64PDF}" target="_blank">Haz clic aquí para descargar tus códigos</a>`;
      
      res.json({ success: true, htmlPDF });
    });
    pdfDocs.addPage();

    for(let i=0; i<cantidad; i++) {
      const codigo = 'CODE' + Date.now() + '-' + i;
      const url = `https://encuentramisllaves.neocities.org?codigo=${encodeURIComponent(codigo)}`;

      // Generar QR y agregar al PDF
      const qrImage = await QRCode.toBuffer(url);
      pdfDocs.image(qrImage, { fit: [200, 200], align: 'center' });
      pdfDocs.text(`Código: ${codigo}`, { align: 'center' });
      pdfDocs.addPage();
    }
    pdfDocs.end();

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// Iniciar servidor
app.listen(3000, () => console.log('Servidor en puerto 3000'));
