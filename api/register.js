// File: /api/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { name, email, whatsapp, divisi, reason } = req.body;

  if (!name || !email || !whatsapp || !divisi || !reason) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const content = `📥 **Pendaftaran Baru**\n` +
                  `🗓️ **Tanggal:** ${timestamp}\n` +
                  `👤 **Nama:** ${name}\n` +
                  `📧 **Email:** ${email}\n` +
                  `📱 **WhatsApp:** ${whatsapp}\n` +
                  `🧩 **Divisi:** ${divisi}\n` +
                  `📝 **Alasan:** ${reason}`;

  const webhookUrl = "https://discord.com/api/webhooks/1347552599871717436/ankRLys5tIbDCbYyXIaqlaILXNnA2rLQdNnjs26N1I7fzbi11mMMuTjsdXJFmy7SvJVl";

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("Gagal kirim ke Discord:", errorText);
      return res.status(500).json({ message: 'Gagal mengirim data ke Discord' });
    }

    return res.status(200).json({ message: 'Pendaftaran berhasil!' });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengirim data' });
  }
}
