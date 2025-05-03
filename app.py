from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/getirihesapla', methods=['POST'])
def hesapla():
    try:
        data = request.json
        tarih = data['tarih']
        tutar = float(data['tutar'])
    except:
        return jsonify({"error": "Geçersiz istek verisi"}), 400

    # Frankfurter.app geçmiş kuru USD -> TRY
    try:
        api_url = f"https://api.frankfurter.app/{tarih}?from=USD&to=TRY"
        response = requests.get(api_url)
        usd_past_rate = response.json()["rates"]["TRY"]
    except:
        return jsonify({"error": "Geçmiş kur verisi alınamadı"}), 500

    # Bugünkü kur için tarih yerine 'latest' yerine bugün'ün tarihi verilmeli çünkü Frankfurter'da /latest yok
    from datetime import date
    today = date.today().isoformat()

    try:
        today_url = f"https://api.frankfurter.app/{today}?from=USD&to=TRY"
        response_today = requests.get(today_url)
        usd_today_rate = response_today.json()["rates"]["TRY"]
    except:
        return jsonify({"error": "Bugünkü kur verisi alınamadı"}), 500

    # Getiri hesapla
    try:
        usd_return = tutar / usd_past_rate * usd_today_rate
    except:
        return jsonify({"error": "Getiri hesaplanamadı"}), 500

    return jsonify({
        "usd": round(usd_return, 2),
        "usd_past_rate": round(usd_past_rate, 2),
        "usd_today_rate": round(usd_today_rate, 2)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
