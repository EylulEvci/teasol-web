// Package web, derlenmiş React çıktısını binary'nin içinde taşır.
package web

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var bundle embed.FS

// FS, dist klasörünü kök kabul eden bir dosya sistemi döndürür.
func FS() (fs.FS, error) {
	return fs.Sub(bundle, "dist")
}