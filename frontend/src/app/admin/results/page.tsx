"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BrainCircuit, Clock } from "lucide-react"

export default function AdminResultsPage() {
    const [attempts, setAttempts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await api.get("/attempts/all/admin")
                setAttempts(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAttempts()
    }, [])

    if (loading) return <div className="p-8 text-center text-gray-500">Loading results data...</div>

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Student Results</h1>
                <p className="text-muted-foreground mt-1">Review all student exam attempts, scores, and AI grading across the platform.</p>
            </div>

            <div className="space-y-4">
                {attempts.map((attempt) => {
                    const isPass = (attempt.score || 0) >= 60

                    return (
                        <Card key={attempt.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className={`p-6 flex flex-col items-center justify-center shrink-0 w-full md:w-32 ${isPass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <div className="text-3xl font-bold">{attempt.score}<span className="text-sm opacity-70">%</span></div>
                                    <div className="text-xs uppercase tracking-wider font-semibold mt-1">{isPass ? 'Pass' : 'Fail'}</div>
                                </div>

                                <CardContent className="p-6 flex-1 grid md:grid-cols-2 gap-4 h-full">
                                    <div>
                                        <h3 className="font-semibold text-lg">{attempt.exam.title}</h3>
                                        <p className="text-sm text-gray-500">{attempt.exam.subject.name}</p>

                                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                {attempt.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{attempt.user.name}</div>
                                                <div className="text-xs">{attempt.user.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-start md:items-end gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Submitted {new Date(attempt.submittedAt).toLocaleDateString()} at {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {attempt.answers?.some((a: any) => a.aiScore !== null) && (
                                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                <BrainCircuit className="w-3 h-3" /> Includes AI Graded Essays
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    )
                })}
                {attempts.length === 0 && (
                    <div className="text-center p-8 bg-gray-50 border border-dashed rounded-xl text-gray-500">
                        No exam attempts recorded yet.
                    </div>
                )}
            </div>
        </div>
    )
}
