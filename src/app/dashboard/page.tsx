'use client';
import AuthCheck from '@/components/AuthCheck';
import Dashboard from '../pages/dashboard';

export default function DashboardPage() {
    return (
        <AuthCheck>
            <Dashboard />
        </AuthCheck>
    );
}
