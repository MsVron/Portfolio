import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/common/Navbar"
import Home from "./pages/Home"
import PortfolioPage from "./pages/PortfolioPage"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/common/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <img src="/logo192.png" alt="Logo" className="h-8 w-8 mr-2" />
                  <span className="text-white font-medium">Portfolio</span>
                </div>
                <div className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Your Name. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
