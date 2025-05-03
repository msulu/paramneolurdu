function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;

    const backendURL = "https://senin-render-url.onrender.com/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("sonuc").innerHTML = `
            <p><strong>Geçmiş Kur:</strong> ${data.usd_past_rate}</p>
            <p><strong>Bugünkü Kur:</strong> ${data.usd_today_rate}</p>
            <p><strong>Getiri:</strong> ${data.usd} TL</p>
        `;
    })
    .catch(() => {
        document.getElementById("sonuc").innerText = "Hesaplama sırasında hata oluştu.";
    });
}
