"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">PharmaConnect</h1>
         <div className="flex gap-4">
         <nav>
            <Link href="/login">
                Login
            </Link>
          </nav>
          <nav>
          <Link href="/signup">
                Sign up
            </Link>
          </nav>
         </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to PharmaConnect
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mb-8">
          A digital solution to streamline pharmacy and dispensary management,
          ensuring better healthcare delivery and patient care.
        </p>
        <div className="space-x-4">
          <Link href="/login">
              Get Started
          </Link>
          <Link href="#features">
              Learn More
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white p-6">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Why Choose PharmaConnect?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-100 rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold text-gray-700 mb-4">
                E-Prescriptions
              </h4>
              <p className="text-gray-600">
                Seamlessly generate and manage digital prescriptions with QR
                codes for easy access and tracking.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-gray-100 rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold text-gray-700 mb-4">
                Online Appointments
              </h4>
              <p className="text-gray-600">
                Schedule and manage doctor appointments with a user-friendly
                interface.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-gray-100 rounded-md shadow-md text-center">
              <h4 className="text-xl font-bold text-gray-700 mb-4">
                Automated Reminders
              </h4>
              <p className="text-gray-600">
                Receive notifications for appointments, prescription refills, and
                follow-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PharmaConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
