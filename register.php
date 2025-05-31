<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $whatsapp = htmlspecialchars($_POST['whatsapp']);
    $divisi = htmlspecialchars($_POST['divisi']);
    $reason = htmlspecialchars($_POST['reason']);

    $data = "Nama: $name\nEmail: $email\nWhatsApp: $whatsapp\nDivisi: $divisi\nAlasan: $reason\n---\n";

    file_put_contents("data-pendaftar.txt", $data, FILE_APPEND);

    echo "<script>alert('Pendaftaran berhasil!'); window.location.href='index.html';</script>";
}
?>