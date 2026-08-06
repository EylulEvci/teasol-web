package main

import (
	"fmt"
	"os"

	"teasol.com/site/internal/content"
)

func main() {
	site, err := content.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Brand : %s\n", site.Brand.Name)
	fmt.Printf("Tagline : %s\n", site.Brand.Tagline)

	fmt.Println("Nav :   ")
	for _, link := range site.Nav {
		fmt.Printf(" %-10s -> %s\n", link.Label, link.Href)
	}

}
