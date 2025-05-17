"use client"
import { useAuth } from "../../context/AuthContext"
import Button from "../common/Button"

const PortfolioPreview = () => {
  const { currentUser } = useAuth()

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="bg-gray-800 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Portfolio Preview</h3>
            <p className="text-gray-300 mb-6">
              This is how your portfolio will appear to visitors. You can customize the layout, colors, and content in
              the settings.
            </p>

            <div className="aspect-video bg-gray-900 rounded-lg mb-6 overflow-hidden">
              <iframe
                src={`/portfolio/${currentUser?.uid}`}
                className="w-full h-full border-0"
                title="Portfolio Preview"
              ></iframe>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">View Live Portfolio</Button>
              <Button variant="outline">Share Portfolio</Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-gray-800 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Portfolio Stats</h3>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Views</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Projects</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Skills</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400">Last Updated</div>
                <div className="text-lg font-medium text-white">Never</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPreview
