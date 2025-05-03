function hesapla() {
    const tarih = document.getElementById("tarih").value;
    const tutar = document.getElementById("tutar").value;
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
                if (!past.rates || !today.rates) throw new Error("Döviz kurları alınamadı.");

                const eurPast = past.rates.EUR;
                const eurToday = today.rates.EUR;
                const plnPast = past.rates.PLN;
                const plnToday = today.rates.PLN;

                const eurChange = ((eurToday - eurPast) / eurPast * 100).toFixed(1);
                const plnChange = ((plnToday - plnPast) / plnPast * 100).toFixed(1);

                const eurAmount = (usd_return * eurToday).toFixed(2);
                const plnAmount = (usd_return * plnToday).toFixed(2);

                document.getElementById("sonuc").innerHTML = `
                    <p><strong>${tarih}</strong> tarihinde ${tutar} TL ile dolar alsaydın,</p>
                    <p>bugün <strong>${bugun}</strong> itibariyle karşılığı:</p>
                    <ul>
                        <li><strong>USD:</strong> ${usd_return} TL 
                            <br>Kur: ${data.usd_past_rate} → ${data.usd_today_rate} 
                            (<strong>${usdChange}%</strong>)</li>
                        <li><strong>EUR:</strong> ${eurAmount} TL 
                            <br>Kur: ${eurPast} → ${eurToday} 
                            (<strong>${eurChange}%</strong>)</li>
                        <li><strong>PLN:</strong> ${plnAmount} TL 
                            <br>Kur: ${plnPast} → ${plnToday} 
                            (<strong>${plnChange}%</strong>)</li>
                    </ul>
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
