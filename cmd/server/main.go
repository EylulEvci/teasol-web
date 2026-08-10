package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"teasol.com/site/internal/content"
	"teasol.com/site/internal/web"
)

func main() {
	site, err := content.Load()
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

	mux.Handle("/", http.FileServer(http.FS(staticFS)))

	mux.HandleFunc("/api/v1/content/site", func(w http.ResponseWriter, r *http.Request) {
		body, err := json.Marshal(site)
		if err != nil {
			http.Error(w, "could not encode content", http.StatusInternalServerError)
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
