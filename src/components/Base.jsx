import { useEffect } from 'react'
import { Navbar } from './Navbar/Navbar'
import { Toaster } from './ui/sonner'
import { TooltipProvider } from './ui/tooltip'
import { usePreferencesStore, ACCENT_PRESETS } from '@/stores/usePreferencesStore'

export const Base = ({ children }) => {
  const accentColor = usePreferencesStore((s) => s.accentColor)
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion)

  // Apply the chosen accent color to the document root so the whole app
  // re-themes instantly. Falls back to the default if the preset is missing.
  useEffect(() => {
    const preset = ACCENT_PRESETS[accentColor] || ACCENT_PRESETS.teal
    const root = document.documentElement
    root.style.setProperty('--primary', preset.primary)
    root.style.setProperty('--accent', preset.accent)
    return () => {
      root.style.removeProperty('--primary')
      root.style.removeProperty('--accent')
    }
  }, [accentColor])

  // Apply the global reduce-motion flag so CSS animations are skipped
  // everywhere (not just in components that read the store).
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = reduceMotion
      ? 'true'
      : 'false'
    return () => {
      delete document.documentElement.dataset.reduceMotion
    }
  }, [reduceMotion])

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative flex min-h-svh flex-col bg-background text-foreground">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh] bg-hero-gradient"
        />
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col focus:outline-none"
        >
          {children}
        </main>
        <footer
          role="contentinfo"
          className="mt-auto border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground sm:text-sm"
        >
          Hecho con <span aria-hidden>♥</span> por ti —&nbsp;
          <span className="font-display font-semibold text-foreground">
            Avatars<span className="text-gradient-brand">.dev</span>
          </span>
        </footer>
        <Toaster position="top-center" richColors />
      </div>
    </TooltipProvider>
  )
}
