"use client"

import { withAuth } from "@/components/providers"

function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen pt-20 relative">
            {/* Page background — covers all student pages except lessons (which override with their own layout) */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=3432&auto=format&fit=crop')`,
                }}
            />
            {/* Dark overlay for readability */}
            <div className="fixed inset-0 -z-10 bg-[#0a0a0f]/85 backdrop-blur-[2px]" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}

export default withAuth(StudentLayout, ['STUDENT'])
