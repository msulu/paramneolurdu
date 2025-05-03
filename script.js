function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;

    // Buraya kendi Replit linkini yapıştırmalısın
    const backendURL = "https://your-replit-name.repl.co/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("sonuc").innerText = `USD Return: ${data.usd} TL`;
    })
    .catch(err => {
        document.getElementById("sonuc").innerText = "Hesaplama sırasında hata oluştu.";
    });
}
