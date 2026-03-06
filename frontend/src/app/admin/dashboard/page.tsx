"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, subjects: 0, exams: 0, attempts: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, subjects, exams, attempts] = await Promise.all([
                    api.get("/users"),
                    api.get("/subjects"),
                    api.get("/exams"),
                    api.get("/attempts/all/admin")
                ])
                setStats({
                    users: users.data.length,
                    subjects: subjects.data.length,
                    exams: exams.data.length,
                    attempts: attempts.data.length
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading dashboard...
        </div>
    )

    const statCards = [
        { title: "Total Users", value: stats.users, icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
        { title: "Subjects", value: stats.subjects, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { title: "Exams", value: stats.exams, icon: FileText, color: "text-teal-400", bg: "bg-teal-500/10" },
        { title: "Attempts", value: stats.attempts, icon: TrendingUp, color: "text-lime-400", bg: "bg-lime-500/10" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-2">Platform overview and quick actions.</p>
                </div>
                <Link href="/admin/subjects">
                    <Button>Manage Subjects</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="hover:border-green-500/20 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
