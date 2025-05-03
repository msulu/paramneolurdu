function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;

    const backendURL = "https://paramneolurdu.onrender.com/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(async res => {
        const text = await res.text();  // Yanıtı düz metin olarak al
        console.log("Gelen yanıt:", text);  // Konsola yazdır (debug için)

        if (!res.ok) {
            throw new Error("Sunucu hatası: " + text);
        }

        const data = JSON.parse(text);  // JSON olarak parse et

        document.getElementById("sonuc").innerHTML = `
            <p><strong>Geçmiş Kur:</strong> ${data.usd_past_rate}</p>
            <p><strong>Bugünkü Kur:</strong> ${data.usd_today_rate}</p>
            <p><strong>Getiri:</strong> ${data.usd} TL</p>
        `;
    })
    .catch(err => {
        console.error("Hata oluştu:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}
