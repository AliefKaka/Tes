import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  let body;

  try {
    body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
  } catch (err) {
    console.error('❌ Body tidak valid:', err);
    return res.status(400).json({ message: 'Format body tidak valid' });
  }

  const { name, email, whatsapp, divisi, reason } = body;

  // Validasi field
  if (!name?.trim() || !email?.trim() || !whatsapp?.trim() || !divisi?.trim() || !reason?.trim()) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return res.status(500).json({ message: 'Token penyimpanan tidak tersedia.' });
  }

  const blobData = {
    name: name.trim(),
    email: email.trim(),
    whatsapp: whatsapp.trim(),
    divisi: divisi.trim(),
    reason: reason.trim(),
    timestamp,
  };

  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `pendaftaran-${Date.now()}-${safeName}.json`;

  try {
    const blob = await put(filename, JSON.stringify(blobData, null, 2), {
      access: 'public',
      token: blobToken,
    });

    console.log('✅ Data berhasil disimpan di Blob:', blob.url);

    return res.status(200).json({
      message: 'Pendaftaran berhasil!',
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('❌ Gagal menyimpan ke Blob:', error);
    return res.status(500).json({
      message: 'Gagal menyimpan data',
      error: error.message,
    });
  }
}
