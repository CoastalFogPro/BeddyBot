"use client";

import { useState, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';

export const dynamic = "force-dynamic";

function DebugContent() {
    const sessionObj = useSession();
    const session = sessionObj?.data;
    const sessionStatus = sessionObj?.status;

    const [status, setStatus] = useState<any>(null);
    const [syncResult, setSyncResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // 1. Fetch System Status (Env checks)
    const fetchSystemStatus = async () => {
        const res = await fetch('/api/debug/system');
        const data = await res.json();
        setStatus(data);
    };

    // 2. Run Sync
    const runSync = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/sync', { method: 'POST' });
            const data = await res.json();
            setSyncResult(data);
        } catch (err: any) {
            setSyncResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStatus();
    }, []);

    if (sessionStatus === 'loading') return <div className="p-8 text-white">Loading Debugger...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-red-500">🔧 Live Debugger</h1>

            {!session && (
                <div className="bg-red-900/50 p-4 border border-red-500 rounded mb-6 text-red-200">
                    Warning: No Session Detected. You might be logged out or the session cookie is missing.
                    <br />
                    Status: {sessionStatus}
                </div>
            )}

            <div className="grid gap-8">
                {/* System Status */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">System Configuration</h2>
                    {status ? (
                        <pre className="bg-black p-4 rounded text-sm overflow-auto text-green-400">
                            {JSON.stringify(status, null, 2)}
                        </pre>
                    ) : (
                        <p>Loading system status...</p>
                    )}
                </div>

                {/* User Status */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Your Account (DB)</h2>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
                        <p><strong>ID:</strong> {session?.user?.id || 'N/A'}</p>
                    </div>
                </div>

                {/* Sync Tool */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-400">Force Subscription Sync</h2>
                    <p className="mb-4 text-slate-400">This will search Stripe for your email and attempt to link any found payments.</p>

                    <button
                        onClick={runSync}
                        disabled={loading || !session}
                        className={`font-bold py-2 px-6 rounded-lg transition-colors ${loading || !session ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                    >
                        {loading ? 'Running Search...' : 'Find My Subscription'}
                    </button>

                    {syncResult && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Result:</h3>
                            <pre className="bg-black p-4 rounded text-sm overflow-auto text-yellow-300">
                                {JSON.stringify(syncResult, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DebugPage() {
    return (
        <SessionProvider>
            <DebugContent />
        </SessionProvider>
    );
}
