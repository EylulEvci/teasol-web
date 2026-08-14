package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strings"

	"teasol.com/site/internal/content"
	"teasol.com/site/internal/web"
)

func main() {
	bundle, err := content.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()

	staticFS, err := web.FS()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	mux.Handle("/", spaHandler(staticFS))

	// ?lang=tr gibi bir parametre bekler; bilinmeyen dilde İngilizceye düşer
	mux.HandleFunc("/api/v1/content/site", func(w http.ResponseWriter, r *http.Request) {
		site, lang := bundle.Site(r.URL.Query().Get("lang"))

		body, err := json.Marshal(site)
		if err != nil {
			http.Error(w, "could not encode content", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		// hangi dilin döndüğünü istemciye bildir
		w.Header().Set("Content-Language", lang)
		w.Write(body)
	})

	// istemci hangi dillerin mevcut olduğunu buradan öğrenir
	mux.HandleFunc("/api/v1/content/languages", func(w http.ResponseWriter, r *http.Request) {
		body, err := json.Marshal(bundle.Languages())
		if err != nil {
			http.Error(w, "could not encode languages", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Write(body)
	})

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Write([]byte(`{"status":"ok"}`))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	fmt.Println("listening on http://localhost:" + port)

	if err := http.ListenAndServe(":"+port, mux); err != nil {
		fmt.Fprintf(os.Stderr, "serve error: %v\n", err)
		os.Exit(1)
	}

}

// spaHandler statik dosyaları sunar; dosya bulunamazsa index.html döner,
// böylece istemci tarafındaki router adresi çözebilir.
func spaHandler(fsys fs.FS) http.Handler {
	fileServer := http.FileServer(http.FS(fsys))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/")
		if name == "" {
			name = "index.html"
		}

		if _, err := fs.Stat(fsys, name); err != nil {
			r.URL.Path = "/"
			name = "index.html"
		}

		// assets/ altındaki dosya adları içeriğin özetini taşır
		// (index-DXYHangt.css gibi). İçerik değişirse ad da değişir,
		// o yüzden bu dosyalar süresiz önbelleğe alınabilir.
		//
		// index.html ise her seferinde doğrulanmalı: içindeki dosya
		// adları her derlemede değiştiği için eski bir kopya, artık
		// var olmayan bir CSS dosyasını işaret eder.
		if strings.HasPrefix(name, "assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}

		fileServer.ServeHTTP(w, r)
	})
}
