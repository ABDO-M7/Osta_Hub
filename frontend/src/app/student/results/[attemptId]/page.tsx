"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, ArrowLeft, CheckCircle2, XCircle, BrainCircuit, Sparkles, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function ExamResultsPage() {
    const params = useParams()
    const id = params?.attemptId
    const [attempt, setAttempt] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)

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

    const handleGenerateAnalysis = async () => {
        if (!id) return
        setGenerating(true)
        try {
            const res = await api.post(`/attempts/${id}/analyze`)
            setAttempt({ ...attempt, aiAnalysis: res.data.aiAnalysis })
        } catch (err) {
            console.error(err)
        } finally {
            setGenerating(false)
        }
    }

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
                {/* AI Analysis Section */}
                <div className="mb-10">
                    <Card className="border-violet-500/20 bg-[#0d0d14]/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
                        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                                <Sparkles className="w-5 h-5 text-violet-400" />
                                AI Performance Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {attempt.aiAnalysis ? (
                                <div className="prose prose-invert prose-violet max-w-none text-gray-300">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mt-5 mb-3" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white mt-4 mb-2" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                            li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-semibold text-violet-300" {...props} />,
                                            em: ({node, ...props}) => <em className="text-gray-400 italic" {...props} />,
                                        }}
                                    >
                                        {attempt.aiAnalysis}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BrainCircuit className="w-12 h-12 text-violet-500/50 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">Unlock Your Personalized Insights</h3>
                                    <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                                        Have our AI securely analyze your specific mistakes and generate a tailored revision roadmap just for you.
                                    </p>
                                    <Button
                                        onClick={handleGenerateAnalysis}
                                        disabled={generating}
                                        className="bg-violet-600 hover:bg-violet-700 text-white gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    >
                                        {generating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Analyzing Your Exam...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Generate AI Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-2xl font-bold border-b pb-2 text-white/90">Detailed Feedback</h2>

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
