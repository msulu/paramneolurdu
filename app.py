from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/getirihesapla', methods=['POST'])
def hesapla():
    data = request.json
    tarih = data['tarih']
    tutar = float(data['tutar'])

    # 1. Geçmiş kuru çek
    api_url = f"https://api.exchangerate.host/{tarih}?base=USD&symbols=TRY"
    response = requests.get(api_url)
    if response.status_code != 200:
        return jsonify({"error": "Kur bilgisi alınamadı"}), 500

    usd_past_rate = response.json()["rates"]["TRY"]

    # 2. Bugünkü kuru çek
    today_url = "https://api.exchangerate.host/latest?base=USD&symbols=TRY"
    response_today = requests.get(today_url)
    if response_today.status_code != 200:
        return jsonify({"error": "Bugünkü kur alınamadı"}), 500

    usd_today_rate = response_today.json()["rates"]["TRY"]

    # 3. Getiri hesapla
    usd_return = tutar / usd_past_rate * usd_today_rate

    return jsonify({
        "usd": round(usd_return, 2),
        "usd_past_rate": round(usd_past_rate, 2),
        "usd_today_rate": round(usd_today_rate, 2)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
