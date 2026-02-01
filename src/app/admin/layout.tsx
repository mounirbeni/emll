import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="admin-layout flex min-h-screen flex-col">
            {children}
        </div>
    )
}
