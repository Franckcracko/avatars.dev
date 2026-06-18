import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './components/theme/ThemeProvider.jsx'
import './index.css'

const root = document.getElementById('root')

if (root) {
  ReactDOM.createRoot(root).render(
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  )
}
