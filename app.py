from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import date

app = Flask(__name__)
CORS(app)

def get_exchange_rate(date_str, from_currency):
    url = f"https://api.frankfurter.app/{date_str}?from={from_currency}&to=TRY"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()["rates"]["TRY"]

def hesapla_kar(tutar, gecmis_kur, bugun_kur):
    miktar = tutar / gecmis_kur * bugun_kur
    artıs = (bugun_kur - gecmis_kur) / gecmis_kur * 100
    return {
        "past": round(gecmis_kur, 4),
        "today": round(bugun_kur, 4),
        "return": round(miktar, 2),
        "change": round(artıs, 2)
    }

@app.route('/api/getirihesapla', methods=['POST'])
def hesapla():
    try:
        data = request.json
        tarih = data['tarih']
        tutar = float(data['tutar'])
    except:
        return jsonify({"error": "Geçersiz istek verisi"}), 400

    today = date.today().isoformat()

    try:
        usd_past = get_exchange_rate(tarih, "USD")
        usd_today = get_exchange_rate(today, "USD")
        eur_past = get_exchange_rate(tarih, "EUR")
        eur_today = get_exchange_rate(today, "EUR")
        pln_past = get_exchange_rate(tarih, "PLN")
        pln_today = get_exchange_rate(today, "PLN")

        result = {
            "usd": hesapla_kar(tutar, usd_past, usd_today),
            "eur": hesapla_kar(tutar, eur_past, eur_today),
            "pln": hesapla_kar(tutar, pln_past, pln_today),
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Kur verileri alınamadı: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
