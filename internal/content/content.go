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

// Feature bir ikon + başlık + açıklama kartı.
type Feature struct {
	Icon        string `json:"icon"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Item başlık + açıklama çifti.
type Item struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Stat bir sayı ve etiketi.
type Stat struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

// Office bir ofis konumu.
type Office struct {
	City    string `json:"city"`
	Country string `json:"country"`
}

type Home struct {
	Title    string    `json:"title"`
	Subtitle string    `json:"subtitle"`
	Features []Feature `json:"features"`
}

type Solutions struct {
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Items    []Item `json:"items"`
}

type About struct {
	Title      string   `json:"title"`
	Paragraphs []string `json:"paragraphs"`
	Stats      []Stat   `json:"stats"`
}

type Contact struct {
	Title    string   `json:"title"`
	Subtitle string   `json:"subtitle"`
	Email    string   `json:"email"`
	Offices  []Office `json:"offices"`
}

// Site, site.json dosyasının tamamının Go karşılığı
type Site struct {
	Brand     Brand     `json:"brand"`
	Nav       []Link    `json:"nav"`
	Home      Home      `json:"home"`
	Solutions Solutions `json:"solutions"`
	About     About     `json:"about"`
	Contact   Contact   `json:"contact"`
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
