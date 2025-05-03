function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;

    // Buraya kendi Replit linkini yapıştırmalısın
    const backendURL = "https://8a3b78ea-8bef-474b-a0c1-0aa774465fd2-00-35tt28tt6sl64.kirk.replit.dev/api/getirihesapla";

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
