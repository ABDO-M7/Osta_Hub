"use client"

// Inline ghost loader — use this anytime you are fetching data
// e.g. if (loading) return <GhostLoader />

import Loader from "@/app/loader"

export function GhostLoader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
            <Loader />
            <p className="mt-4 text-gray-400 text-sm tracking-widest uppercase animate-pulse">{label}</p>
        </div>
    )
}
