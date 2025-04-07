'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { FaHospital, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const fetchData = async (endpoint) => {
    console.log('Fetching:', `http://localhost:8000${endpoint}`);
    const response = await fetch(`http://localhost:8000${endpoint}`);
    if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Received data:', data);
    return data;
};

const Dashboard = () => {
    const [selectedCity, setSelectedCity] = useState("Mumbai");
    const [selectedMonth, setSelectedMonth] = useState("2020-01");
    const [selectedTrendMonth, setSelectedTrendMonth] = useState("2020-01");

    const monthlyTrends = useQuery({
        queryKey: ['monthlyDiseaseTrends', selectedTrendMonth],
        queryFn: () => fetchData(`/trends/monthly-disease-trends?month=${selectedTrendMonth}`)
    });

    const seasonalOccurrence = useQuery({
        queryKey: ['seasonalDiseaseOccurrence'],
        queryFn: () => fetchData('/heatmap/seasonal-disease-occurrence')
    });

    const casesByCity = useQuery({
        queryKey: ['casesByCity'],
        queryFn: () => fetchData('/distribution/cases-by-city')
    });

    const casesByAge = useQuery({
        queryKey: ['casesByAge'],
        queryFn: () => fetchData('/distribution/cases-by-age')
    });

    const severityDistribution = useQuery({
        queryKey: ['severityDistribution'],
        queryFn: () => fetchData('/distribution/severity-count')
    });

    const resourceUsageTrends = useQuery({
        queryKey: ['resourceUsageTrends', selectedCity, selectedMonth],
        queryFn: () => fetchData(`/trends/resource-usage?city=${selectedCity}&month=${selectedMonth}`)
    });

    const generateMonthOptions = () => {
        const options = [];
        const startDate = new Date(2020, 0); // January 2020
        const endDate = new Date(2023, 11);  // December 2023

        while (startDate <= endDate) {
            const monthStr = startDate.toISOString().slice(0, 7); // Format: YYYY-MM
            const displayStr = startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
            options.push({ value: monthStr, label: displayStr });
            startDate.setMonth(startDate.getMonth() + 1);
        }
        return options;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/home"
                                className="flex items-center text-gray-800 hover:text-gray-900"
                            >
                                <FaArrowLeft className="h-5 w-5" />
                                <span className="ml-2">Back to Home</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <FaHospital className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Medical Dashboard</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    MIT Group of Hospitals Analytics Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Monthly Disease Trends Widget */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {monthlyTrends.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : monthlyTrends.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Monthly Disease Trends</h2>
                                    <select
                                        className="p-2 border rounded-md text-gray-900 w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedTrendMonth}
                                        onChange={(e) => setSelectedTrendMonth(e.target.value)}
                                    >
                                        {generateMonthOptions().map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyTrends.data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis dataKey="disease_name" tick={{ fontSize: 12, fill: '#666' }} />
                                        <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="cases" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>

                    {/* Seasonal Disease Occurrence */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {seasonalOccurrence.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : seasonalOccurrence.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Seasonal Disease Occurrence</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={seasonalOccurrence.data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="cases" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>

                    {/* Cases by City */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {casesByCity.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : casesByCity.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Cases by City</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={casesByCity.data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="city" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cases" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>

                    {/* Cases by Age */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {casesByAge.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : casesByAge.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Cases by Age</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={casesByAge.data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="age" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cases" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>

                    {/* Severity Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {severityDistribution.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : severityDistribution.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Severity Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={severityDistribution.data}
                                            dataKey="cases"
                                            nameKey="severity"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            label
                                        />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>

                    {/* Resource Usage Trends */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        {resourceUsageTrends.isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : resourceUsageTrends.isError ? (
                            <div className="flex items-center justify-center h-64 text-red-600">
                                Error loading data
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Resource Usage Trends - {selectedCity}</h2>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <select
                                        className="p-2 border rounded-md text-gray-900"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                    >
                                        {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
                                            "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"].map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                    </select>
                                    <select
                                        className="p-2 border rounded-md text-gray-900"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {generateMonthOptions().map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        data={resourceUsageTrends.data}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="usedResourcesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="availableResourcesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: '#666' }}
                                            tickFormatter={(dateStr) => {
                                                const date = new Date(dateStr);
                                                return date.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                });
                                            }}
                                            stroke="#666"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#666' }}
                                            label={{
                                                value: 'Resources',
                                                angle: -90,
                                                position: 'insideLeft',
                                                style: { textAnchor: 'middle', fill: '#666' }
                                            }}
                                            stroke="#666"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            }}
                                            formatter={(value, name) => [
                                                Math.round(value),
                                                name === 'used_resources' ? 'Used Resources' : 'Available Resources'
                                            ]}
                                            labelFormatter={(dateStr) => {
                                                const date = new Date(dateStr);
                                                return date.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                });
                                            }}
                                        />
                                        <Legend
                                            formatter={(value) => value === 'used_resources' ? 'Used Resources' : 'Available Resources'}
                                            wrapperStyle={{
                                                paddingTop: '10px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="used_resources"
                                            stackId="1"
                                            stroke="#8884d8"
                                            fill="url(#usedResourcesGradient)"
                                            name="used_resources"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="available_resources"
                                            stackId="1"
                                            stroke="#82ca9d"
                                            fill="url(#availableResourcesGradient)"
                                            name="available_resources"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
