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

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  console.log("Webhook URL:", webhookUrl); // DEBUG

  if (!webhookUrl) {
    return res.status(500).json({ message: 'Webhook Discord belum dikonfigurasi di ENV' });
  }

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
      console.error("Status Discord:", discordResponse.status);
      console.error("Respon Discord:", errorText);
      return res.status(500).json({ message: 'Gagal mengirim ke Discord' });
    }

    return res.status(200).json({ message: 'Pendaftaran berhasil!' });
  } catch (err) {
    console.error("Terjadi error:", err);
    return res.status(500).json({ message: 'Terjadi kesalahan internal' });
  }
}
