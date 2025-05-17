import { Link } from "react-router-dom"
import Button from "../components/common/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-500">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
