function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = parseFloat(document.getElementById("tutar").value);
    const backendURL = "https://paramneolurdu.onrender.com/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(res => res.json())
    .then(data => {
        const usd = data.usd;
        const eur = data.eur;
        const pln = data.pln;

        const bugun = new Date().toISOString().split("T")[0];

        document.getElementById("sonuc").innerHTML = `
            <p>${tarih} tarihinde ${tutar} TL ile <strong>dolar</strong> alsaydın, bugünkü karşılığı <strong>${usd.return} TL</strong> olacaktı.<br>
            Bugünkü kur: ${usd.today}, ${tarih} tarihindeki kur: ${usd.past}, artış: %${usd.change}</p><br>

            <p>${tarih} tarihinde ${tutar} TL ile <strong>euro</strong> alsaydın, bugünkü karşılığı <strong>${eur.return} TL</strong> olacaktı.<br>
            Bugünkü kur: ${eur.today}, ${tarih} tarihindeki kur: ${eur.past}, artış: %${eur.change}</p><br>

            <p>${tarih} tarihinde ${tutar} TL ile <strong>zloty</strong> alsaydın, bugünkü karşılığı <strong>${pln.return} TL</strong> olacaktı.<br>
            Bugünkü kur: ${pln.today}, ${tarih} tarihindeki kur: ${pln.past}, artış: %${pln.change}</p>
        `;
    })
    .catch(err => {
        console.error("Hata:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}
