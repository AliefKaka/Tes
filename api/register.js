// File: /api/register.js (untuk Vercel serverless)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { name, email, whatsapp, divisi, reason } = req.body;

  if (!name || !email || !whatsapp || !divisi || !reason) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const timestamp = new Date().toISOString();
  const entry = `============================\nTanggal: ${timestamp}\nNama: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nDivisi: ${divisi}\nAlasan: ${reason}\n`;

  // Simpan ke file (jika digunakan di lokal dengan fs)
  // Tapi di Vercel, kita tidak bisa menulis file lokal secara permanen.

  console.log(entry); // Untuk testing, tampilkan di log Vercel

  // Kirim notifikasi ke WhatsApp (jika ada integrasi eksternal)
  // Di sini kita hanya kembalikan sukses saja
  return res.status(200).json({ message: 'Pendaftaran berhasil!' });
}
