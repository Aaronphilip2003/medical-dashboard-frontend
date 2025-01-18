'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Widget from '../components/Widget';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';

const fetchData = async (endpoint) => {
    const response = await fetch(`http://localhost:8000${endpoint}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data); 
    return data;
};

const Dashboard = () => {
    const monthlyTrends = useQuery({
        queryKey: ['monthlyDiseaseTrends'],
        queryFn: () => fetchData('/trends/monthly-disease-trends')
    });

    const seasonalOccurrence = useQuery({
        queryKey: ['seasonalDiseaseOccurrence'],
        queryFn: () => fetchData('/heatmap/seasonal-disease-occurrence')
    });

    const casesByCity = useQuery({
        queryKey: ['casesByCity'],
        queryFn: () => fetchData('/distribution/cases-by-city')
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-center text-3xl font-bold py-6 text-gray-900">Medical Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <Widget>
                    {monthlyTrends.isLoading ? (
                        <p>Loading...</p>
                    ) : monthlyTrends.isError ? (
                        <p>Error loading data</p>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Monthly Disease Trends</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrends.data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="cases" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </Widget>

                <Widget>
                    {seasonalOccurrence.isLoading ? (
                        <p>Loading...</p>
                    ) : seasonalOccurrence.isError ? (
                        <p>Error loading data</p>
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
                </Widget>

                <Widget>
                    {casesByCity.isLoading ? (
                        <p>Loading...</p>
                    ) : casesByCity.isError ? (
                        <p>Error loading data</p>
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
                </Widget>
            </div>
        </div>
    );
};

export default Dashboard;
