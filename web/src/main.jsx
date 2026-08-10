import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [site, setSite] = useState(null)

  useEffect(() => {
    fetch('/api/v1/content/site')
      .then((res) => res.json())
      .then((data) => setSite(data))
  }, [])

  if (!site) {
    return <p>Yükleniyor…</p>
  }

  return (
    <main>
      <h1>{site.brand.name}</h1>
      <p>{site.brand.tagline}</p>

      <nav>
        <ul>
          {site.nav.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)