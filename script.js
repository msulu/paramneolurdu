function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;

    const backendURL = "https://paramneolurdu.onrender.com/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {
                throw new Error(err.error || "Sunucu hatası");
            });
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("sonuc").innerHTML = `
            <p><strong>Geçmiş Kur:</strong> ${data.usd_past_rate}</p>
            <p><strong>Bugünkü Kur:</strong> ${data.usd_today_rate}</p>
            <p><strong>Getiri:</strong> ${data.usd} TL</p>
        `;
    })
    .catch(err => {
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}
