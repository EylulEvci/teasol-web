package content

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"sort"
	"strings"
)

// data/site.en.json, site.nl.json, site.tr.json — hepsi tek seferde gömülür
//
//go:embed data/site.*.json
var files embed.FS

// DefaultLang istenen dil bulunamazsa dönülecek dil
const DefaultLang = "en"

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
	Kind    string `json:"kind"`
}

// Reason iletişime geçme sebebi.
type Reason struct {
	Icon        string `json:"icon"`
	Title       string `json:"title"`
	Subject     string `json:"subject"`
	Description string `json:"description"`
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
	Title        string   `json:"title"`
	Subtitle     string   `json:"subtitle"`
	Email        string   `json:"email"`
	ResponseTime string   `json:"responseTime"`
	Reasons      []Reason `json:"reasons"`
	Offices      []Office `json:"offices"`
}

// UI arayüzde geçen sabit metinler.
// Kodun içine gömülü kalsalardı çeviriye açılamazlardı.
type UI struct {
	EyebrowSolutions string `json:"eyebrowSolutions"`
	EyebrowAbout     string `json:"eyebrowAbout"`
	EyebrowContact   string `json:"eyebrowContact"`
	WhereWeWork      string `json:"whereWeWork"`
	WhereWeAre       string `json:"whereWeAre"`
	WriteToUs        string `json:"writeToUs"`
	ReasonCta        string `json:"reasonCta"`
	NotFoundTitle    string `json:"notFoundTitle"`
	NotFoundText     string `json:"notFoundText"`
}

// Site, site.<dil>.json dosyasının tamamının Go karşılığı
type Site struct {
	Brand     Brand     `json:"brand"`
	Nav       []Link    `json:"nav"`
	Home      Home      `json:"home"`
	Solutions Solutions `json:"solutions"`
	About     About     `json:"about"`
	Contact   Contact   `json:"contact"`
	UI        UI        `json:"ui"`
}

// Bundle butun dillerin iceriklerini bir arada tutar.
// Anahtar dil kodu ("en", "nl", "tr"), deger o dilin tam icerigi.
type Bundle struct {
	sites map[string]Site
}

// Load gömülü butun site.<dil>.json dosyalarını okur.
func Load() (*Bundle, error) {
	// data klasorundeki dosya adlarini bul
	names, err := fs.Glob(files, "data/site.*.json")
	if err != nil {
		return nil, fmt.Errorf("glob content files: %w", err)
	}
	if len(names) == 0 {
		return nil, fmt.Errorf("no content files embedded")
	}

	sites := make(map[string]Site, len(names))

	for _, name := range names {
		// "data/site.tr.json" -> "tr"
		base := strings.TrimSuffix(strings.TrimPrefix(name, "data/site."), ".json")

		raw, err := files.ReadFile(name)
		if err != nil {
			return nil, fmt.Errorf("read %s: %w", name, err)
		}

		var site Site
		if err := json.Unmarshal(raw, &site); err != nil {
			return nil, fmt.Errorf("decode %s: %w", name, err)
		}

		sites[base] = site
	}

	// varsayilan dil yoksa geri kalani anlamsiz olur
	if _, ok := sites[DefaultLang]; !ok {
		return nil, fmt.Errorf("default language %q missing", DefaultLang)
	}

	return &Bundle{sites: sites}, nil
}

// Site istenen dilin icerigini dondurur.
// Dil bilinmiyorsa varsayilan dile duser; ikinci deger hangi dilin dondugunu soyler.
func (b *Bundle) Site(lang string) (Site, string) {
	if site, ok := b.sites[lang]; ok {
		return site, lang
	}
	return b.sites[DefaultLang], DefaultLang
}

// Languages mevcut dil kodlarini alfabetik sirada dondurur.
func (b *Bundle) Languages() []string {
	langs := make([]string, 0, len(b.sites))
	for lang := range b.sites {
		langs = append(langs, lang)
	}
	// map'in sirasi Go'da rastgeledir, o yuzden siraliyoruz
	sort.Strings(langs)
	return langs
}
