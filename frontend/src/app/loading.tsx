import Loader from "./loader"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]">
            <Loader />
            <p className="mt-6 text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
        </div>
    )
}
