"use client"

import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/ui/Logo"

const features = [
    {
        icon: "🧠",
        title: "AI Grading & Analysis",
        description: "Submit essays for instant AI feedback. After exams, Gemini identifies your weak points and generates a personalized revision roadmap.",
    },
    {
        icon: "📚",
        title: "Block-Based Learning",
        description: "Every subject is organized into rich, interactive blocks — live code, math formulas, reading content, and embedded quizzes.",
    },
    {
        icon: "🔥",
        title: "Advanced Tracking & Streaks",
        description: "Monitor your scores, build unbreakable daily learning streaks, and track your actual lesson completion progress automatically.",
    },
    {
        icon: "📝",
        title: "Interactive Notebooks",
        description: "Jot down your private study notes on a sliding floating panel without ever leaving the lesson you are currently reading.",
    },
    {
        icon: "🚀",
        title: "Any Device, Anywhere",
        description: "Fully responsive design so you can study seamlessly from your phone, tablet, or desktop. Pick up exactly where you left off.",
    },
    {
        icon: "🔐",
        title: "Secure & Frictionless",
        description: "Instant OAuth login via Google and GitHub. Your data is protected and your learning journey is personalized and private.",
    },
]

export default function AboutPage() {
    return (
        <main className="min-h-screen relative overflow-hidden text-white/90">
            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <section className="text-center px-4 py-24 relative z-10">
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(57,12,237,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />

                <div className="relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        What is{" "}
                        <Logo glow />?
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: "rgba(247,235,249,0.75)" }}>
                        <Logo /> is a next-generation EdTech platform that combines structured learning with cutting-edge AI to help students
                        study smarter, not harder.
                    </p>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(247,235,249,0.5)" }}>
                        Built for ambitious students who want real results — not just passive watching.
                    </p>
                </div>
            </section>

            {/* ─── How it works ─────────────────────────────────────────── */}
            <section className="px-4 py-16 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#f7ebf9" }}>
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: "01", title: "Sign In", desc: "Login instantly with your Google or GitHub account — no passwords needed." },
                        { step: "02", title: "Pick a Subject", desc: "Browse structured subjects and dive into rich, block-based lessons at your own pace." },
                        { step: "03", title: "Take Exams", desc: "Test your knowledge with timed exams and get AI-graded feedback on your essays instantly." },
                    ].map(({ step, title, desc }) => (
                        <div
                            key={step}
                            className="p-6 rounded-2xl relative overflow-hidden"
                            style={{
                                background: "rgba(57,12,237,0.07)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            <div className="text-5xl font-black mb-4 opacity-20" style={{ color: "#390ced" }}>{step}</div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: "#f7ebf9" }}>{title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,235,249,0.6)" }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Features ─────────────────────────────────────────────── */}
            <section className="px-4 py-16 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#f7ebf9" }}>
                    Everything you need to excel
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
                            style={{
                                background: "rgba(103,43,115,0.08)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                backdropFilter: "blur(16px)",
                            }}
                        >
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="font-bold text-base mb-2" style={{ color: "#f7ebf9" }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,235,249,0.55)" }}>{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────────── */}
            <section className="text-center py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(57,12,237,0.15), transparent)" }} />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "#f7ebf9" }}>Ready to level up?</h2>
                    <p className="text-lg mb-8" style={{ color: "rgba(247,235,249,0.6)" }}>
                        Join thousands of students already learning on <Logo />.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300"
                        style={{
                            background: "rgba(57,12,237,0.3)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            color: "#f7ebf9",
                            boxShadow: "0 0 40px rgba(57,12,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                    >
                        Start Learning Free
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* ─── Footer ───────────────────────────────────────────────── */}
            <footer className="text-center py-8 border-t text-sm" style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(247,235,249,0.3)" }}>
                © 2025 <Logo /> — Built with ❤️ for ambitious learners
            </footer>
        </main>
    )
}
