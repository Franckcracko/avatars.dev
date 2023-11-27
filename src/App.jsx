import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditPage from './pages/EditPage'
import PreferencesPage from './pages/PreferencesPage'
import AvatarsPage from './pages/AvatarsPage'

function App () {
  return (
    <BrowserRouter basename="/">
      <Routes >
        <Route path="/" element={<HomePage/>} />
        <Route path="/avatars" element={<AvatarsPage />} />
        <Route path="/preferencias" element={<PreferencesPage />} />
        <Route path="/editar" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
