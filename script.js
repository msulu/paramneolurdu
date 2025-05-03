function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = parseFloat(document.getElementById("tutar").value);
    const backendURL = "https://paramneolurdu.onrender.com/api/getirihesapla";
    const bugun = new Date().toISOString().split("T")[0];

    try {
        fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tarih, tutar })
        })
        .then(async res => {
            const text = await res.text();
            if (!res.ok) throw new Error(text);
            const data = JSON.parse(text);
            const usd_return = data.usd;

            const usdChange = ((data.usd_today_rate - data.usd_past_rate) / data.usd_past_rate * 100).toFixed(1);

            const pastRatesURL = `https://api.frankfurter.app/${tarih}?from=USD&to=EUR,PLN`;
            const todayRatesURL = `https://api.frankfurter.app/${bugun}?from=USD&to=EUR,PLN`;

            return Promise.all([
                fetch(pastRatesURL).then(r => r.json()),
                fetch(todayRatesURL).then(r => r.json())
            ]).then(([past, today]) => {
                const eurPast = past.rates.EUR;
                const eurToday = today.rates.EUR;
                const plnPast = past.rates.PLN;
                const plnToday = today.rates.PLN;

                const eurChange = ((eurToday - eurPast) / eurPast * 100).toFixed(1);
                const plnChange = ((plnToday - plnPast) / plnPast * 100).toFixed(1);

                const usdCikti = `
                    ${tarih} tarihinde ${tutar} TL ile dolar alsaydın, bugünkü karşılığı ${usd_return.toFixed(2)} TL olacaktı.
                    Bugünkü kur: ${data.usd_today_rate}, ${tarih} tarihindeki kur: ${data.usd_past_rate}, artış: %${usdChange}
                `;

                const eurAmount = (usd_return * eurToday).toFixed(2);
                const eurCikti = `
                    ${tarih} tarihinde ${tutar} TL ile euro alsaydın, bugünkü karşılığı ${eurAmount} TL olacaktı.
                    Bugünkü kur: ${eurToday}, ${tarih} tarihindeki kur: ${eurPast}, artış: %${eurChange}
                `;

                const plnAmount = (usd_return * plnToday).toFixed(2);
                const plnCikti = `
                    ${tarih} tarihinde ${tutar} TL ile zloty alsaydın, bugünkü karşılığı ${plnAmount} TL olacaktı.
                    Bugünkü kur: ${plnToday}, ${tarih} tarihindeki kur: ${plnPast}, artış: %${plnChange}
                `;

                document.getElementById("sonuc").innerHTML = `
                    <p>${usdCikti}</p><br>
                    <p>${eurCikti}</p><br>
                    <p>${plnCikti}</p>
                `;
            });
        })
        .catch(err => {
            console.error("Hata:", err);
            document.getElementById("sonuc").innerHTML = `
                <p style="color:red;">Hata: ${err.message}</p>
            `;
        });
    } catch (err) {
        console.error("Kritik Hata:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Beklenmeyen bir hata oluştu.</p>
        `;
    }
}
