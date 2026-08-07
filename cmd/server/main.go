package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"teasol.com/site/internal/content"
)

func main() {
	site, err := content.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "%s- %s\n", site.Brand.Name, site.Brand.Tagline)
	})

	mux.HandleFunc("/api/v1/content/site", func(w http.ResponseWriter, r *http.Request) {
		body, err := json.Marshal(site)
		if err != nil {
			http.Error(w, "could not encode content", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Write(body)
	})

	fmt.Println("listening on http://localhost:8081")

	if err := http.ListenAndServe(":8081", mux); err != nil {
		fmt.Fprintf(os.Stderr, "serve error: %v\n", err)
		os.Exit(1)
	}

}
