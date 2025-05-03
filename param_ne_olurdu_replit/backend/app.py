from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/getirihesapla', methods=['POST'])
def hesapla():
    data = request.json
    tarih = data['tarih']
    tutar = float(data['tutar'])

    usd_past_rate = 2.1
    usd_today_rate = 32.0

    usd_return = tutar / usd_past_rate * usd_today_rate

    return jsonify({"usd": round(usd_return, 2)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
