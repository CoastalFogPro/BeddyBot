"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function AdminLink() {
    const { data: session } = useSession();
    // @ts-ignore
    const isAdmin = session?.user?.role === 'admin';

    if (!isAdmin) return null;

    return (
        <a
            href="/admin"
            className="flex items-center gap-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-3 py-2 rounded-lg transition-colors border border-purple-500/20 text-sm font-medium"
        >
            <Shield size={16} />
            Admin Panel
        </a>
    );
}
