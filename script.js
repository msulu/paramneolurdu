document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tutar").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            hesapla();
        }
    });
});

let chart = null;

function hesapla() {
    const [day, month, year] = document.getElementById("tarih").value.split("/");
    const tarih = `${year}-${month}-${day}`;
    const tutar = parseFloat(document.getElementById("tutar").value);
    const backendURL = "http://127.0.0.1:10000/api/getirihesapla";

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarih, tutar })
    })
    .then(res => res.json())
    .then(data => {
        function kartHTML(doviz, label, icon, colorClass, result) {
            const miktar = (tutar / result.past).toFixed(6);
            const changeClass = result.change >= 0 ? "positive" : "negative";
            const changeSymbol = result.change >= 0 ? "📈" : "📉";
            return `
                <div class="card ${colorClass}">
                    <h3><strong>${label} alsaydın</strong> (${miktar} ${doviz}) ${icon}</h3>
                    <p><strong>${result.return} TL</strong> olurdu</p>
                    <p>${day}/${month}/${year} tarihindeki kur: ${result.past}</p>
                    <p>Güncel kur: ${result.today}</p>
                    <p class="change ${changeClass}">Artış oranı: %${result.change} ${changeSymbol}</p>
                </div>
            `;
        }

        let html = "";
        html += kartHTML("USD", "USD", "🇺🇸", "usd", data.usd);
        html += kartHTML("EUR", "EUR", "🇪🇺", "eur", data.eur);
        html += kartHTML("PLN", "PLN", "🇵🇱", "pln", data.pln);
        if (data.btc) {
            html += kartHTML("BTC", "Bitcoin", "₿", "btc", data.btc);
        }

        document.getElementById("sonuc").innerHTML = html;

        renderElegantBarChart(data);
    })
    .catch(err => {
        console.error("Hata:", err);
        document.getElementById("sonuc").innerHTML = `
            <p style="color:red;">Hata: ${err.message}</p>
        `;
    });
}

function renderElegantBarChart(data) {
    const ctx = document.getElementById("grafik").getContext("2d");
    if (chart) chart.destroy();

    const labels = [];
    const values = [];
    const colors = [];
    const borderColors = [];

    function add(d, label, renk) {
        labels.push(label);
        values.push(d.change);
        if (d.change >= 0) {
            colors.push("rgba(40, 167, 69, 0.2)");
            borderColors.push("#28a745");
        } else {
            colors.push("rgba(220, 53, 69, 0.2)");
            borderColors.push("#dc3545");
        }
    }

    if (data.usd) add(data.usd, "USD", "#0d6efd");
    if (data.eur) add(data.eur, "EUR", "#28a745");
    if (data.pln) add(data.pln, "PLN", "#fd7e14");
    if (data.btc) add(data.btc, "BTC", "#f7931a");

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Artış Oranı (%)",
                data: values,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `%${ctx.raw}`
                    }
                },
                datalabels: {
                    anchor: "end",
                    align: "end",
                    color: "#333",
                    font: { weight: "bold" },
                    formatter: value => `%${value}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `%${value}`
                    },
                    grid: { color: "#eee" }
                },
                x: {
                    grid: { display: false }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
