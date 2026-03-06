"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookOpen, Award, Clock } from "lucide-react"

export default function StudentDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [subjects, setSubjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, subjectsRes] = await Promise.all([
                    api.get("/users/me/stats"),
                    api.get("/subjects")
                ])
                setStats(statsRes.data)
                setSubjects(subjectsRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading dashboard...
        </div>
    )

    const statCards = [
        { title: "Exams Taken", value: stats?.totalAttempts || 0, icon: Clock, color: "text-green-400", bg: "bg-green-500/10" },
        { title: "Completed", value: stats?.completedAttempts || 0, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { title: "Average Score", value: `${stats?.averageScore || 0}%`, icon: Award, color: "text-teal-400", bg: "bg-teal-500/10" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">My Dashboard</h1>
                <p className="text-gray-400 mt-2">Welcome back! Track your progress and continue learning.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
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

            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Available Subjects</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject) => (
                        <Link key={subject.id} href={`/student/subjects/${subject.id}`}>
                            <Card className="hover:border-green-500/30 hover:shadow-green-500/5 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col group">
                                <div
                                    className="h-32 w-full bg-cover bg-center rounded-t-xl relative overflow-hidden"
                                    style={{ backgroundImage: `url(${subject.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] to-transparent" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="group-hover:text-green-400 transition-colors">{subject.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{subject.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto pt-0 text-sm text-gray-500 flex gap-4">
                                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {subject._count?.lessons || 0} Lessons</span>
                                    <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {subject._count?.exams || 0} Exams</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {subjects.length === 0 && (
                        <div className="col-span-3 text-center p-8 bg-[#12121a] border border-[#1e1e2e] rounded-xl text-gray-500">
                            No subjects available yet. Check back later.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
