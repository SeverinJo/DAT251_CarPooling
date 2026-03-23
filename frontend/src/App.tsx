import Layout from "./components/Layout";
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import TripPlanning from './pages/TripPlanning'

function App() {
  return (
      <Layout>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/trip" element={<TripPlanning />} />
          </Routes>
      </Layout>
  )
}

export default App
