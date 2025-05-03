from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import date, datetime

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

def get_btc_prices(tarih):
    d = datetime.strptime(tarih, "%Y-%m-%d")
    formatted_date = d.strftime("%d-%m-%Y")

    url_past = f"https://api.coingecko.com/api/v3/coins/bitcoin/history?date={formatted_date}"
    print("BTC geçmiş fiyat isteği:", url_past)
    past_res = requests.get(url_past).json()
    btc_past = past_res.get("market_data", {}).get("current_price", {}).get("usd")

    if btc_past is None:
        raise Exception(f"BTC geçmiş fiyatı bulunamadı. Yanıt: {past_res}")

    url_today = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    today_res = requests.get(url_today).json()
    btc_today = today_res.get("bitcoin", {}).get("usd")

    if btc_today is None:
        raise Exception(f"BTC bugünkü fiyatı bulunamadı. Yanıt: {today_res}")

    return btc_past, btc_today

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
            "pln": hesapla_kar(tutar, pln_past, pln_today)
        }

        try:
            btc_past_usd, btc_today_usd = get_btc_prices(tarih)
            btc_past_try = btc_past_usd * usd_past
            btc_today_try = btc_today_usd * usd_today
            result["btc"] = hesapla_kar(tutar, btc_past_try, btc_today_try)
            print("BTC başarıyla eklendi.")
        except Exception as e:
            print("BTC hatası:", e)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Kur verileri alınamadı: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
