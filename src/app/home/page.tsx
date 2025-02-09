'use client';
import Link from 'next/link';
import { FaChartLine, FaHospital, FaUserMd, FaRobot, FaUserCircle } from 'react-icons/fa';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaHospital className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">MedDash</span>
                        </div>
                        <Link
                            href="/login"
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <FaUserCircle className="h-5 w-5" />
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
                        AI-Powered Medical Dashboard
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Revolutionizing healthcare management with advanced analytics and real-time insights
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <span>Access Dashboard</span>
                            <FaChartLine className="ml-2" />
                        </Link>
                        <Link
                            href="/ai-assistant"
                            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <span>Talk to AI Assistant</span>
                            <FaRobot className="ml-2" />
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-blue-600 mb-4">
                            <FaChartLine className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Analytics</h3>
                        <p className="text-gray-600">
                            Monitor medical resources and disease trends with live data updates
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-blue-600 mb-4">
                            <FaHospital className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Resource Management</h3>
                        <p className="text-gray-600">
                            Efficiently track and manage medical resources across facilities
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-blue-600 mb-4">
                            <FaUserMd className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Disease Tracking</h3>
                        <p className="text-gray-600">
                            Monitor disease trends and patterns with advanced visualization
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-md mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-600">
                        © 2024 MedDash. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
