import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { name, email, whatsapp, divisi, reason } = req.body;

  if (!name || !email || !whatsapp || !divisi || !reason) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const content =
    `📥 **Pendaftaran Baru**\n` +
    `🗓️ **Tanggal:** ${timestamp}\n` +
    `👤 **Nama:** ${name}\n` +
    `📧 **Email:** ${email}\n` +
    `📱 **WhatsApp:** ${whatsapp}\n` +
    `🧩 **Divisi:** ${divisi}\n` +
    `📝 **Alasan:** ${reason}`;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    // Kirim ke Discord
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    }

    // Simpan ke Blob
    const filename = `pendaftaran-${Date.now()}-${name.replace(/\s/g, "_").toLowerCase()}.json`;

    const blobData = {
      name,
      email,
      whatsapp,
      divisi,
      reason,
      timestamp
    };

    const blob = await put(filename, JSON.stringify(blobData, null, 2), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // Gunakan token otomatis dari Vercel
    });

    return res.status(200).json({
      message: 'Pendaftaran berhasil!',
      blobUrl: blob.url
    });
  } catch (error) {
    console.error("Kesalahan saat proses:", error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat memproses data' });
  }
}
