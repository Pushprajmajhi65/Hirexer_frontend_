import React from "react";
import { AlertTriangle } from "lucide-react"; // Optional icon

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Optionally log the error to an external service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <div className="max-w-md w-full bg-white border border-red-100 shadow-md rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4 text-red-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Oops! Something went wrong.</h2>
            <p className="text-gray-600 text-sm mt-2">
              We ran into an issue while loading this part of the app. Please try again in a moment.
            </p>
            {this.state.error?.message && (
              <p className="text-xs text-gray-400 mt-1 italic">
                Error: {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;