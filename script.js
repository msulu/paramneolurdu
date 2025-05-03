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

        const sonucHTML = `
            <div class="card">
                <h3>USD 🇺🇸</h3>
                <p>${tarih} tarihinde ${tutar} TL → <strong>${usd.return} TL</strong> (${(tutar / usd.past).toFixed(2)} USD)</p>
                <p>O zamanki kur: ${usd.past}</p>
                <p>Güncel kur: ${usd.today}</p>
                <p>Artış oranı: %${usd.change}</p>
            </div>
            <div class="card">
                <h3>EUR 🇪🇺</h3>
                <p>${tarih} tarihinde ${tutar} TL → <strong>${eur.return} TL</strong> (${(tutar / eur.past).toFixed(2)} EUR)</p>
                <p>O zamanki kur: ${eur.past}</p>
                <p>Güncel kur: ${eur.today}</p>
                <p>Artış oranı: %${eur.change}</p>
            </div>
            <div class="card">
                <h3>PLN 🇵🇱</h3>
                <p>${tarih} tarihinde ${tutar} TL → <strong>${pln.return} TL</strong> (${(tutar / pln.past).toFixed(2)} PLN)</p>
                <p>O zamanki kur: ${pln.past}</p>
                <p>Güncel kur: ${pln.today}</p>
                <p>Artış oranı: %${pln.change}</p>
            </div>
        `;

        document.getElementById("sonuc").innerHTML = sonucHTML;
    })
    .catch(err => {
        console.error("Hata:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}
