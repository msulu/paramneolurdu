Bu klasör Netlify'a doğrudan sürükleyip bırakmak için hazırdır.

Kullanım:
1. https://netlify.com sitesine giriş yap.
2. Dashboard'da "Add new site" > "Deploy manually" seçeneğini seç.
3. Bu klasörü ZIP'ten çıkar ve içindekileri Netlify sayfasına sürükle bırak.
4. Yayınlandıktan sonra backend URL'ini script.js dosyasındaki `backendURL` değişkenine yazmayı unutma!


# Param Ne Olurdu? (Render.com İçin Flask Backend)

## 1. Dosya Açıklamaları
- `app.py`: Flask backend uygulaması
- `requirements.txt`: Bağımlılıklar
- `render.yaml`: Render servisi yapılandırma dosyası (isteğe bağlı)

## 2. Yayınlama Adımları (https://render.com)

1. https://render.com adresine git ve ücretsiz hesap oluştur.
2. GitHub hesabını bağla.
3. "New Web Service" seç.
4. Bu dosyaları bir GitHub reposuna yükle.
5. Render üzerinden bu repoyu seç ve deploy et.

### Önemli:
- `start command`: `python app.py`
- `build command`: `pip install -r requirements.txt`

Deploy tamamlandığında sana public bir API URL’si verilecek. Frontend'in `script.js` dosyasındaki `backendURL` kısmını bu URL ile güncelle.
