"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, ArrowLeft, CheckCircle2, XCircle, BrainCircuit } from "lucide-react"

export default function ExamResultsPage() {
    const params = useParams()
    const id = params?.attemptId
    const [attempt, setAttempt] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchResults = async () => {
            try {
                const res = await api.get(`/attempts/${id}`)
                setAttempt(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [id])

    if (loading) return <div className="p-8 text-center text-gray-500">Loading exam results...</div>
    if (!attempt) return <div className="p-8 text-center text-red-500">Attempt not found</div>

    const isPass = (attempt.score || 0) >= 60

    return (
        <div className="max-w-4xl mx-auto pb-24 space-y-8">
            <Link href="/student/dashboard" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className={`p-8 rounded-2xl text-white flex flex-col items-center justify-center relative overflow-hidden ${isPass ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-orange-400 to-red-600'}`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
                <Award className="h-20 w-20 mb-4 drop-shadow-lg text-white" />
                <h1 className="text-3xl font-bold mb-2 z-10">{attempt.exam.title}</h1>
                <p className="text-green-50 text-xl z-10 opacity-90">{attempt.exam.subject.name}</p>
                <div className="mt-8 text-6xl font-extrabold drop-shadow-md z-10 flex items-baseline">
                    {attempt.score}<span className="text-3xl ml-1 opacity-80">%</span>
                </div>
                <p className="mt-4 font-medium text-lg z-10 bg-black/20 px-6 py-2 rounded-full">
                    {isPass ? 'Congratulations! You passed.' : 'Keep studying. You can try again.'}
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">Detailed Feedback</h2>

                {attempt.answers.map((ans: any, idx: number) => {
                    const q = ans.question
                    const isEssay = q.type === 'ESSAY'
                    const correct = ans.isCorrect

                    return (
                        <Card key={ans.id} className={`border-l-4 ${isEssay ? 'border-l-indigo-500' : correct ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg flex gap-3">
                                        <span className="text-gray-400">Q{idx + 1}.</span>
                                        {q.text}
                                    </h3>
                                    <div className="shrink-0 flex items-center gap-2">
                                        {isEssay ? (
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full flex gap-1 items-center">
                                                <BrainCircuit className="w-3 h-3" /> AI Graded {ans.aiScore ? `${ans.aiScore}%` : 'Pending'}
                                            </span>
                                        ) : correct ? (
                                            <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-5 h-5" /> Correct</span>
                                        ) : (
                                            <span className="text-red-600 flex items-center gap-1 font-medium"><XCircle className="w-5 h-5" /> Incorrect</span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-500 mb-1">Your Answer:</div>
                                    <div className="text-gray-900 mb-4">{ans.response || <span className="text-gray-400 italic">No answer provided</span>}</div>

                                    {!isEssay && !correct && q.correctAnswer && (
                                        <div className="border-t pt-3 mt-3">
                                            <div className="text-sm font-medium text-green-600 mb-1 border-green-200">Correct Answer:</div>
                                            <div className="text-gray-900">{q.correctAnswer}</div>
                                        </div>
                                    )}

                                    {isEssay && ans.aiFeedback && (
                                        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                            <div className="text-sm font-semibold text-indigo-800 flex items-center gap-2 mb-2">
                                                <BrainCircuit className="w-4 h-4" />
                                                AI Grading Feedback
                                            </div>
                                            <p className="text-indigo-900 text-sm leading-relaxed">{ans.aiFeedback}</p>
                                            {ans.aiScore && (
                                                <div className="mt-3 text-right">
                                                    <span className="bg-white text-indigo-800 font-bold px-3 py-1 rounded-full text-xs shadow-sm border border-indigo-100">
                                                        Score awarded: {((ans.aiScore / 100) * q.points).toFixed(1)} / {q.points} points
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
