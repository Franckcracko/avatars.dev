import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

const buildAvatar = (seed, configs, { backgroundColor, size = 512 } = {}) =>
  createAvatar(avataaars, {
    ...configs,
    seed,
    size,
    ...(backgroundColor && backgroundColor !== 'transparent'
      ? { backgroundColor }
      : {})
  })

const buildFilename = (name, useName) => {
  if (useName) {
    const safe = (name || 'avatar')
      .toString()
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()
    return safe || 'avatar'
  }
  return 'avatar'
}

const dataUriToBlob = (dataUri) => {
  const [meta, base64] = dataUri.split(',')
  const mime = meta.match(/data:(.*?);/)?.[1] || 'image/png'
  const bin = atob(base64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const buildAvatarSvg = (seed, configs, { backgroundColor, size = 512 }) => {
  return buildAvatar(seed, configs, { backgroundColor, size }).toString()
}

export const downloadAvatar = async (
  seed,
  configs,
  {
    name = 'avatar',
    format = 'svg',
    useName = true,
    backgroundColor,
    size = 512
  } = {}
) => {
  const avatar = buildAvatar(seed, configs, { backgroundColor, size })
  const base = buildFilename(name, useName)

  if (format === 'svg') {
    const blob = new Blob([avatar.toString()], { type: 'image/svg+xml' })
    triggerDownload(blob, `${base}.svg`)
    return
  }

  const png = await avatar.png().toDataUri()
  triggerDownload(dataUriToBlob(png), `${base}.${format}`)
}

export const copyAvatarToClipboard = async (
  seed,
  configs,
  { backgroundColor, size = 512 } = {}
) => {
  if (!navigator?.clipboard || typeof window.ClipboardItem === 'undefined') {
    throw new Error('Tu navegador no soporta copiar al portapapeles')
  }
  const avatar = buildAvatar(seed, configs, { backgroundColor, size })
  const dataUri = await avatar.png().toDataUri()
  const blob = dataUriToBlob(dataUri)
  const item = new window.ClipboardItem({ 'image/png': blob })
  await navigator.clipboard.write([item])
  return true
}
