// File: /api/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { name, email, whatsapp, divisi, reason } = req.body;

  // Validasi input
  if (!name || !email || !whatsapp || !divisi || !reason) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const content = `📥 **Pendaftaran Baru**
🗓️ Tanggal: ${timestamp}
👤 Nama: ${name}
📧 Email: ${email}
📱 WhatsApp: ${whatsapp}
🧩 Divisi: ${divisi}
📝 Alasan: ${reason}`;

  const webhookUrl = process.env.DISCORD_WEBHOOK;

  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK tidak disetel di environment');
    return res.status(500).json({ message: 'Webhook tidak dikonfigurasi' });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    return res.status(200).json({ message: 'Pendaftaran berhasil!' });
  } catch (error) {
    console.error('Gagal mengirim ke Discord:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengirim data' });
  }
}
