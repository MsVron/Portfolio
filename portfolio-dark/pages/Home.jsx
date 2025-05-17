"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/common/Button"

const Home = () => {
  const { currentUser } = useAuth()

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900"></div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                <span className="block">Creative Developer</span>
                <span className="block text-purple-400">Portfolio Showcase</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl">
                Showcase your projects, skills, and experience with this modern portfolio website. Perfect for
                developers, designers, and creative professionals.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/portfolio">
                  <Button variant="primary" size="lg">
                    View Portfolio
                  </Button>
                </Link>

                {currentUser ? (
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="outline" size="lg">
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-96 bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 mix-blend-overlay"></div>
                <img
                  src="/placeholder.svg?height=384&width=640"
                  alt="Portfolio Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Showcase Your Work</h2>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to present your projects professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Portfolio</h3>
              <p className="text-gray-400">
                Showcase your projects with beautiful cards, detailed descriptions, and links to live demos and code
                repositories.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Skills Showcase</h3>
              <p className="text-gray-400">
                Display your technical skills, categorize them, and visualize your proficiency levels with interactive
                elements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional Profile</h3>
              <p className="text-gray-400">
                Create a compelling professional profile with your bio, experience, and links to your social media and
                professional networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to showcase your work?</h2>
                <p className="mt-3 text-lg text-purple-100">
                  Create your portfolio in minutes and share it with the world.
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <Link to={currentUser ? "/dashboard" : "/register"}>
                  <Button variant="primary" size="lg">
                    {currentUser ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
