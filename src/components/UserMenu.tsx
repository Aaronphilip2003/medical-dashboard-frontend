'use client';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserMenu() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(authStatus === 'true');

        // Click outside handler
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        router.push('/');
    };

    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
                <FaUserCircle className="h-5 w-5" />
                <span>Login</span>
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <FaUserCircle className="h-8 w-8" />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
} 