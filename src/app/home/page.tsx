'use client';
import Link from 'next/link';
import { FaChartLine, FaHospital, FaUserMd, FaRobot } from 'react-icons/fa';
import UserMenu from '@/components/UserMenu';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Prediction {
    date: string;
    predicted_cases: number;
    confidence_lower: number;
    confidence_upper: number;
}

const DISEASES = ['COVID19', 'Influenza', 'Dengue', 'Malaria', 'Typhoid', 'Pneumonia'];
const CITIES = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Mumbai'];

export default function HomePage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDisease, setSelectedDisease] = useState('COVID19');
    const [selectedCity, setSelectedCity] = useState('Bangalore');

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://medical-backend-664549437927.us-central1.run.app/predictions/disease/${selectedCity}/${selectedDisease}?days=30`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );
            const data = await response.json();
            setPredictions(data);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FaHospital className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                MedDash
                            </span>
                        </div>
                        <UserMenu />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center space-y-8">
                    <h1 className="text-6xl font-black text-gray-900 tracking-tight">
                        AI-Powered
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Medical Dashboard
                        </span>
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            with LSTM Predictions
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Revolutionizing healthcare management with advanced analytics and real-time insights
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link
                            href="/dashboard"
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                        >
                            <span>Access Dashboard</span>
                            <FaChartLine className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/ai-assistant"
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                        >
                            <span>Talk to AI Assistant</span>
                            <FaRobot className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Predictions Section */}
                <div className="mt-32">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Disease Predictions</h2>
                        <p className="mt-2 text-gray-600">View 30-day disease predictions by city</p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                            >
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedDisease}
                                onChange={(e) => setSelectedDisease(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                            >
                                {DISEASES.map((disease) => (
                                    <option key={disease} value={disease}>
                                        {disease}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={fetchPredictions}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {loading ? 'Loading...' : 'Get Predictions'}
                            </button>
                        </div>
                    </div>

                    {predictions.length > 0 && (
                        <>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    {selectedDisease} Predictions for {selectedCity}
                                </h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={predictions}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            formatter={(value) => [Math.round(value as number), 'Cases']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="predicted_cases"
                                            stroke="#2563eb"
                                            name="Predicted Cases"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="confidence_lower"
                                            stroke="#93c5fd"
                                            strokeDasharray="5 5"
                                            name="Lower Bound"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="confidence_upper"
                                            stroke="#93c5fd"
                                            strokeDasharray="5 5"
                                            name="Upper Bound"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    How We Make These Predictions
                                </h3>
                                <div className="space-y-4 text-gray-600">
                                    <p>
                                        Our predictions are powered by a sophisticated Long Short-Term Memory (LSTM) neural network,
                                        specifically designed for time series forecasting. Here&apos;s how our model works:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        <div className="bg-white/50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Model Architecture</h4>
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>Input Layer: 7-day sequential data with multiple features</li>
                                                <li>First LSTM Layer: 50 units with ReLU activation</li>
                                                <li>Dropout Layer (20%): Prevents overfitting</li>
                                                <li>Second LSTM Layer: 50 units with ReLU activation</li>
                                                <li>Final Dense Layer: Single unit for prediction</li>
                                            </ul>
                                        </div>

                                        <div className="bg-white/50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Features Considered</h4>
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>Historical case numbers</li>
                                                <li>Temperature and humidity data</li>
                                                <li>Rainfall patterns</li>
                                                <li>Population mobility index</li>
                                                <li>Vaccination rates</li>
                                                <li>Social distancing metrics</li>
                                                <li>Mask compliance rates</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Confidence Intervals</h4>
                                        <p>
                                            The dashed lines represent 95% confidence intervals, calculated using standard deviation
                                            of predictions. This provides a range where we expect the actual values to fall, accounting
                                            for prediction uncertainty.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Model Training</h4>
                                        <p>
                                            The model is trained using historical data with the Adam optimizer and Mean Squared Error loss function.
                                            We use a sliding window approach with 7-day sequences to capture weekly patterns and trends in the data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Features Section */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <FaChartLine className="h-8 w-8" />,
                            title: "Real-time Analytics",
                            description: "Monitor medical resources and disease trends with live data updates"
                        },
                        {
                            icon: <FaHospital className="h-8 w-8" />,
                            title: "Resource Management",
                            description: "Efficiently track and manage medical resources across facilities"
                        },
                        {
                            icon: <FaUserMd className="h-8 w-8" />,
                            title: "Disease Tracking",
                            description: "Monitor disease trends and patterns with advanced visualization"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="text-blue-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-md mt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-gray-600">
                        © 2024 MedDash. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
