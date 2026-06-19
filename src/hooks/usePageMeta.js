import { useEffect } from 'react'

const SITE_NAME = 'Avatars.Dev'
const SITE_URL = 'https://avatars-dev.vercel.app'
const DEFAULT_IMAGE = 'https://avatars-dev.vercel.app/og-image.svg'
const DEFAULT_DESCRIPTION =
  'Genera, personaliza y descarga avatares únicos en segundos. Ruleta mágica, edición completa y exportación en SVG, PNG o JPG. 100% gratis, sin registro.'

const setMeta = (selector, attr, value) => {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(
      selector.startsWith('meta[') ? 'meta' : 'link'
    )
    const [, key, val] = selector.match(/\[(\w+)="([^"]+)"\]/) || []
    if (key) el.setAttribute(key, val)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const upsertJsonLd = (id, data) => {
  if (!data) return
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Per-page SEO meta updater.
 *
 * Updates:
 *   - document.title
 *   - <meta name="description">
 *   - canonical link
 *   - Open Graph (title, description, url, image, type)
 *   - Twitter Card (title, description, image)
 *   - optional JSON-LD block
 */
export function usePageMeta ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
  keywords
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Generador de avatares con ruleta mágica`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    // Primary
    setMeta('meta[name="description"]', 'content', description)
    if (keywords?.length) {
      setMeta('meta[name="keywords"]', 'content', keywords.join(', '))
    }
    if (noindex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow')
    } else {
      setMeta('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // Canonical
    setLink('canonical', url)

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[property="og:type"]', 'content', type)

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:url"]', 'content', url)
    setMeta('meta[name="twitter:image"]', 'content', image)
  }, [title, description, path, image, type, noindex, keywords])

  useEffect(() => {
    if (jsonLd) upsertJsonLd('page-jsonld', jsonLd)
  }, [jsonLd])
}
