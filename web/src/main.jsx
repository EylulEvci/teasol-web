import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'

import './index.css'

const SOLUTION_COLORS = [
  { main: '#1d4ed8', soft: '#eef3ff' },
  { main: '#0891b2', soft: '#e6f6fa' },
  { main: '#4f46e5', soft: '#eeedfd' },
  { main: '#7c3aed', soft: '#f3edff' },
]

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
    play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5z" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5a4 4 0 0 1 0-5.6l2.1-2.1a4 4 0 0 1 5.6 5.6l-1 1" />
      <path d="M14.5 9.5a4 4 0 0 1 0 5.6l-2.1 2.1a4 4 0 0 1-5.6-5.6l1-1" />
    </>
  ),
  star: (
    <>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
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

const LANG_LABELS = { en: 'EN', nl: 'NL', tr: 'TR' }

// Icerik daha yuklenmeden ekrana gelir, o yuzden site.json'dan gelemez.
// Weblate'in gormedigi tek metin bu.
const LOADING = { en: 'Loading…', nl: 'Laden…', tr: 'Yükleniyor…' }

function LangSwitch({ langs, lang, onChange }) {
  if (langs.length < 2) return null

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {langs.map((code) => (
        <button
          key={code}
          type="button"
          className={code === lang ? 'active' : undefined}
          aria-pressed={code === lang}
          onClick={() => onChange(code)}
        >
          {LANG_LABELS[code] ?? code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function Layout({ site, langs, lang, onLangChange, children }) {
  const { pathname } = useLocation()
  const pageClass =
    pathname === '/solutions' ? 'p-solutions'
    : pathname === '/about' ? 'p-about'
    : pathname === '/contact' ? 'p-contact'
    : 'p-home'

  return (
    <div className={`page ${pageClass}`}>
      <header className="site-header">
        <NavLink to="/" className="brand">
          <img src="/logo.png" alt={site.brand.name} />
        </NavLink>
        <nav>
          {site.nav.map((link) => (
            <NavLink key={link.href} to={link.href} end={link.href === '/'}>
              {link.label}
            </NavLink>
          ))}
          <LangSwitch langs={langs} lang={lang} onChange={onLangChange} />
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
      <section className="hero hero-home">
        <video
          className="hero-video"
          src="/video/hero.mp4"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
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
    <>
      <section className="hero hero-solutions">
        <div className="wrap">
          <p className="eyebrow">{site.ui.eyebrowSolutions}</p>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>
      </section>

      <section className="wrap section">
        <div className="cards two">
          {items.map((item, i) => {
            const c = SOLUTION_COLORS[i % SOLUTION_COLORS.length]
            return (
              <article
                key={item.title}
                className="card solution"
                style={{ '--c': c.main, '--c-soft': c.soft }}
              >
                <span className="badge">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}

function About({ site }) {
  const { title, paragraphs, stats } = site.about

  return (
    <>
      <section className="hero hero-about">
        <div className="wrap">
          <p className="eyebrow">{site.ui.eyebrowAbout}</p>
          <h1>{title}</h1>
        </div>
      </section>

      <section className="wrap section">
        <div className="prose">
          {paragraphs.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="sub">{site.ui.whereWeWork}</h2>
        <div className="cities">
          {site.contact.offices.map((o, i) => (
            <article key={o.city} className={i === 0 ? 'city is-hq' : 'city'}>
              <span className="city-kind">{o.kind}</span>
              <strong>{o.city}</strong>
              <span className="city-country">{o.country}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-band">
        <div className="wrap">
          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Contact({ site }) {
  const { title, subtitle, email, responseTime, reasons, offices } = site.contact

  return (
    <>
      <section className="hero hero-contact">
        <div className="wrap">
          <p className="eyebrow">{site.ui.eyebrowContact}</p>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>
      </section>

      <section className="wrap section">
        <a className="email-card" href={`mailto:${email}`}>
          <span className="email-label">{site.ui.writeToUs}</span>
          <span className="email-value">{email}</span>
          <span className="email-note">{responseTime}</span>
        </a>

                <div className="cards">
          {reasons.map((r) => (
            <a
              key={r.title}
              className="card reason"
              href={`mailto:${email}?subject=${encodeURIComponent(r.subject)}`}
            >
              <span className="card-icon contact-icon">
                <Icon name={r.icon} />
              </span>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <span className="reason-cta">{site.ui.reasonCta} →</span>
            </a>
          ))}
        </div>

        <h2 className="sub">{site.ui.whereWeAre}</h2>
        <div className="cards three">
          {/* ilk ofis genel merkez — kind alani cevrildigi icin metne bakilamaz */}
          {offices.map((o, i) => (
            <article key={o.city} className="card office">
              <span className={i === 0 ? 'tag hq' : 'tag'}>{o.kind}</span>
              <h3>{o.city}</h3>
              <p>{o.country}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function NotFound({ site }) {
  return (
    <section className="wrap section">
      <h1>{site.ui.notFoundTitle}</h1>
      <p className="lead">{site.ui.notFoundText}</p>
    </section>
  )
}

function App() {
  const [site, setSite] = useState(null)
  const [langs, setLangs] = useState([])
  // tarayici hatirlasin, sayfa yenilenince dil kaybolmasin
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  // mevcut diller bir kez cekilir
  useEffect(() => {
    fetch('/api/v1/content/languages')
      .then((res) => res.json())
      .then(setLangs)
      .catch(() => setLangs(['en']))
  }, [])

  // dil degistikce icerik yeniden cekilir
  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang

    fetch(`/api/v1/content/site?lang=${encodeURIComponent(lang)}`)
      .then((res) => res.json())
      .then(setSite)
  }, [lang])

  if (!site) return <p className="wrap section">{LOADING[lang] ?? LOADING.en}</p>

  return (
    <BrowserRouter>
      <Layout site={site} langs={langs} lang={lang} onLangChange={setLang}>
        <Routes>
          <Route path="/" element={<Home site={site} />} />
          <Route path="/solutions" element={<Solutions site={site} />} />
          <Route path="/about" element={<About site={site} />} />
          <Route path="/contact" element={<Contact site={site} />} />
          <Route path="*" element={<NotFound site={site} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)