'use client';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Medical Dashboard System
                </h1>
                <p className="text-gray-600 mb-8">
                    Welcome to our medical resource management and disease tracking system
                </p>
                <Link
                    href="/dashboard"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
