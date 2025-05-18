"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ArrowRight, Code, User, Briefcase } from "lucide-react"

const Home = () => {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Showcase Your Professional Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Create a stunning portfolio to highlight your skills, projects, and experience. Stand out in the digital
            world with a personalized professional profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg flex items-center justify-center">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-8 py-3 text-lg flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn btn-outline px-8 py-3 text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Profile</h3>
              <p className="text-muted-foreground">
                Create a comprehensive profile showcasing your professional identity and career goals.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Showcase</h3>
              <p className="text-muted-foreground">
                Display your projects with detailed descriptions, technologies used, and live demos.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experience & Education</h3>
              <p className="text-muted-foreground">
                Highlight your work experience and educational background in a structured format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your Professional Portfolio?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have enhanced their online presence with our platform.
          </p>
          {!currentUser && (
            <Link to="/register" className="btn btn-primary px-8 py-3 text-lg inline-flex items-center">
              Create Your Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
