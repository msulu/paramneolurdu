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

        const usdStr = `
            <div class="card">
                <h3>USD</h3>
                <p>$<strong>USD alsaydın</strong> (${(tutar / usd.past).toFixed(2)} USD)</p>
                <p><strong>${usd.return} TL</strong> olurdu</p>
                <p>O zamanki kur: ${usd.past}</p>
                <p>Güncel kur: ${usd.today}</p>
                <p>Artış oranı: %${usd.change}</p>
            </div>
        `;

        const eurStr = `
            <div class="card">
                <h3>EUR</h3>
                <p><strong>EUR alsaydın</strong> (${(tutar / eur.past).toFixed(2)} EUR)</p>
                <p><strong>${eur.return} TL</strong> olurdu</p>
                <p>O zamanki kur: ${eur.past}</p>
                <p>Güncel kur: ${eur.today}</p>
                <p>Artış oranı: %${eur.change}</p>
            </div>
        `;

        const plnStr = `
            <div class="card">
                <h3>PLN</h3>
                <p><strong>PLN alsaydın</strong> (${(tutar / pln.past).toFixed(2)} PLN)</p>
                <p><strong>${pln.return} TL</strong> olurdu</p>
                <p>O zamanki kur: ${pln.past}</p>
                <p>Güncel kur: ${pln.today}</p>
                <p>Artış oranı: %${pln.change}</p>
            </div>
        `;

        document.getElementById("sonuc").innerHTML = usdStr + eurStr + plnStr;
    })
    .catch(err => {
        console.error("Hata:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}
