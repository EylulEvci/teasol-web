# TEASOL Site

Tek bir Go binary'sinin hem API'yi hem web arayüzünü sunduğu küçük bir site.
Site metinleri ve derlenmiş React çıktısı `//go:embed` ile binary'nin içine
gömülür — container'ın ne volume'e ne de önünde bir web sunucusuna ihtiyacı var.

## Gereksinimler

- **Çalıştırmak için:** sadece Docker
- **Yerel geliştirme için:** Go 1.24+ ve Node 22+

## Çalıştırma

```bash
docker compose up -d
```

http://localhost:8081

Durdurmak için:

```bash
docker compose down
```

## Yerel geliştirme

İki süreç çalışır. Vite'ın dev sunucusu `/api` isteklerini Go sunucusuna
yönlendirir.

**1. terminal — frontend:**

```bash
cd web
npm ci
npm run dev
```

**2. terminal — backend:**

```bash
go run ./cmd/server
```

Arayüz http://localhost:5173, API http://localhost:8081 adresinde.

## Docker olmadan derleme

⚠️ **Önce frontend'i derle.** `//go:embed` dosyaları *derleme anında* okuyor;
`internal/web/dist` klasörü yoksa `go build` hata verir.

```bash
cd web
npm run build
cd ..
go run ./cmd/server
```

## Endpoint'ler

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/` | React arayüzü (gömülü statik dosyalar) |
| `GET` | `/api/v1/content/site` | Site içeriği, JSON |
| `GET` | `/healthz` | Sağlık kontrolü, Docker `HEALTHCHECK` kullanıyor |

## Yapılandırma

| Değişken | Varsayılan | Açıklama |
| --- | --- | --- |
| `PORT` | `8081` | Sunucunun dinlediği port |

## Klasör yapısı

```
cmd/server/          main paketi — sunucu giriş noktası
internal/content/    site metinleri (data/*.json) + yükleme kodu
internal/web/        derlenmiş frontend'i gömen paket
web/                 React kaynak kodu (Vite)
```

## Notlar

- `internal/web/dist` **commit'lenmez** — `npm run build` üretir, Docker build'i
  kendi içinde üretir.
- İmaj üç aşamalı build ile kuruluyor: Node ile frontend, Go ile binary, sonra
  sadece binary `alpine` üzerine kopyalanıyor. Son imaj ~26 MB.
- Container **root olmayan** bir kullanıcıyla çalışır.