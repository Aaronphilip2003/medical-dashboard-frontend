'use client';
import { useState } from 'react';
import { FaRobot, FaArrowLeft, FaCode, FaTable } from 'react-icons/fa';
import Link from 'next/link';
import AuthCheck from '@/components/AuthCheck';

interface ApiResponse {
    success: boolean;
    query?: string;
    answer?: unknown;
    error?: string;
}

type TableValue = string | number | boolean | null;
type TableRow = Record<string, TableValue>;

export default function AIAssistantPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/nlq/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: query }),
            });
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
            setResponse({
                success: false,
                error: 'Failed to connect to the server'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderAnswer = (answer: unknown) => {
        if (!answer) return <div className="text-gray-900">No data available</div>;

        // Handle single value
        if (!Array.isArray(answer)) {
            return (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-900 text-lg">{String(answer)}</div>
                </div>
            );
        }

        // Handle empty array
        if (answer.length === 0) {
            return <div className="text-gray-900">No results found</div>;
        }

        // Handle array of simple values
        if (typeof answer[0] !== 'object') {
            return (
                <div className="space-y-2">
                    {answer.map((value, idx) => (
                        <div key={idx} className="text-gray-900 p-2 bg-gray-50 rounded">
                            {String(value)}
                        </div>
                    ))}
                </div>
            );
        }

        // Handle array of objects (table view)
        const tableData = answer as TableRow[];
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {Object.keys(tableData[0]).map((key) => (
                                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((row, idx) => (
                            <tr key={idx}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i} className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AuthCheck>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
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
                                <FaRobot className="h-8 w-8 text-purple-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">AI Assistant</span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Medical Database AI Assistant
                            </h1>
                            <p className="text-gray-800">
                                Ask questions about medical resources and trends in natural language
                            </p>
                        </div>

                        {/* Query Input */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask a question about medical resources or trends..."
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2
                                    ${isLoading || !query.trim()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                <FaRobot className="h-5 w-5" />
                                <span>{isLoading ? 'Processing...' : 'Ask AI Assistant'}</span>
                            </button>
                        </form>

                        {/* Response Section */}
                        {response && (
                            <div className="mt-8 space-y-6">
                                {response.success ? (
                                    <>
                                        {/* SQL Query */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center text-gray-900 font-medium mb-2">
                                                <FaCode className="mr-2" />
                                                <span>Generated SQL Query</span>
                                            </div>
                                            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                                                {response.query}
                                            </pre>
                                        </div>

                                        {/* Results */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center text-gray-900 font-medium mb-2">
                                                <FaTable className="mr-2" />
                                                <span>Results</span>
                                            </div>
                                            {renderAnswer(response.answer)}
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                                        I&apos;m sorry, I couldn&apos;t understand your query. Please try rephrasing your question.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AuthCheck>
    );
} 