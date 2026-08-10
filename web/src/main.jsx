import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

import './index.css'

const ICONS = {
  venue: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <ellipse cx="12" cy="12" rx="3.5" ry="2.2" />
    </>
  ),
  city: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l5-3v15" />
      <path d="M10 21V11l6-2.5V21" />
      <path d="M16 21v-8l4 1.5V21" />
    </>
  ),
  tower: (
    <>
      <path d="M12 9v12" />
      <path d="M8 21l4-12 4 12" />
      <path d="M9 16h6" />
      <path d="M7.5 7a6 6 0 0 1 9 0" />
      <path d="M5 4.5a10 10 0 0 1 14 0" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h14v17" />
      <path d="M3 21h18" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
    </>
  ),
  transport: (
    <>
      <path d="M4 15V10a2 2 0 0 1 2-2h8l4 4v3" />
      <path d="M4 15h16" />
      <circle cx="8" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 5.6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.6-4-9s1.5-6.5 4-9z" />
    </>
  ),
}

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] ?? ICONS.globe}
    </svg>
  )
}

function Layout({ site, children }) {
  return (
    <div className="page">
      <header className="site-header">
        <NavLink to="/" className="brand">
          {site.brand.name}
        </NavLink>
        <nav>
          {site.nav.map((link) => (
            <NavLink key={link.href} to={link.href} end={link.href === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <p>
          {site.brand.name} — {site.brand.tagline}
        </p>
      </footer>
    </div>
  )
}

function Home({ site }) {
  const { title, subtitle, features } = site.home

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{site.brand.tagline}</p>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>
      </section>

      <section className="wrap section">
        <div className="cards">
          {features.map((f) => (
            <article key={f.title} className="card">
              <span className="card-icon">
                <Icon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function Solutions({ site }) {
  const { title, subtitle, items } = site.solutions

  return (
    <section className="wrap section">
      <h1>{title}</h1>
      <p className="lead">{subtitle}</p>

      <div className="cards two">
        {items.map((item, i) => (
          <article key={item.title} className="card">
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function About({ site }) {
  const { title, paragraphs, stats } = site.about

  return (
    <section className="wrap section">
      <h1>{title}</h1>
      {paragraphs.map((p) => (
        <p key={p} className="lead">
          {p}
        </p>
      ))}

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact({ site }) {
  const { title, subtitle, email, offices } = site.contact

  return (
    <section className="wrap section">
      <h1>{title}</h1>
      <p className="lead">{subtitle}</p>

      <a className="email" href={`mailto:${email}`}>
        {email}
      </a>

      <div className="cards three">
        {offices.map((o) => (
          <article key={o.city} className="card">
            <h3>{o.city}</h3>
            <p>{o.country}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className="wrap section">
      <h1>404</h1>
      <p className="lead">Bu sayfa bulunamadı.</p>
    </section>
  )
}

function App() {
  const [site, setSite] = useState(null)

  useEffect(() => {
    fetch('/api/v1/content/site')
      .then((res) => res.json())
      .then(setSite)
  }, [])

  if (!site) return <p className="wrap section">Yükleniyor…</p>

  return (
    <BrowserRouter>
      <Layout site={site}>
        <Routes>
          <Route path="/" element={<Home site={site} />} />
          <Route path="/solutions" element={<Solutions site={site} />} />
          <Route path="/about" element={<About site={site} />} />
          <Route path="/contact" element={<Contact site={site} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)