package content

import (
	"embed"
	"encoding/json"
	"fmt"
)

//go:embed data/site.json
var files embed.FS

// Link bir baglanti kullanıcının gördüğü yazı ve gideceği adres
type Link struct {
	Label string `json:"label"`
	Href  string `json:"href"`
}

// Brand site adı ve sloganı
type Brand struct {
	Name    string `json:"name"`
	Tagline string `json:"tagline"`
}

// Site, site.json dosyasının tamamının Go karşılığı
type Site struct {
	Brand Brand  `json:"brand"`
	Nav   []Link `json:"nav"`
}

// Load gömülü site.json dosyasını okur ve Site yapısına çevirir.
func Load() (Site, error) {
	raw, err := files.ReadFile("data/site.json")
	if err != nil {
		return Site{}, fmt.Errorf("read site.json: %w", err)
	}

	var site Site
	if err := json.Unmarshal(raw, &site); err != nil {
		return Site{}, fmt.Errorf("decode site.json: %w", err)
	}

	return site, nil

}
