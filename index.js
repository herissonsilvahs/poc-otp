const express = require('express')
const OTPAuth = require('otpauth')
const QRCode = require('qrcode')

const userSecret = 'klsdfhsudfasdfhuhsuildhfausdf' // secret precisa ser salva por usuario e criptografada

const app = express()
app.use(express.json())

app.get('/qrcode-otp', async (req, res) => {
  const totp = new OTPAuth.TOTP({
    issuer: 'My App',
    label: 'My App',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: userSecret,
  });
  let uri = totp.toString();

  console.log('uri:', uri);

  QRCode.toString(uri, { type: 'terminal' }, function (err, data) {
    console.log(data);
  });

  return res.send(uri);
});

app.get('/check', (req, res) => {
  const { code } = req.query;

  const totp = new OTPAuth.TOTP({
    issuer: 'My App',
    label: 'My App',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: userSecret,
  });

  console.log('code:', code)

  const delta = totp.validate({
    token: code,
    window: 1,
  });

  console.log('delta:', delta)

  if (delta < 0 || delta === null) {
    return res.status(400).send('Invalid code');
  }

  return res.send('Valid code');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});
