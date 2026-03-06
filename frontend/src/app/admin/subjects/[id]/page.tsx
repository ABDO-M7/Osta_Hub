"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, FileText, Plus, Trash2, Edit2 } from "lucide-react"

export default function AdminSubjectDetailsPage() {
    const params = useParams()
    const id = params?.id
    const [subject, setSubject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchSubject = async () => {
        try {
            const res = await api.get(`/subjects/${id}`)
            setSubject(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchSubject()
    }, [id])

    const handleDeleteLesson = async (lessonId: number) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return
        try {
            await api.delete(`/lessons/${lessonId}`)
            fetchSubject()
        } catch (err) { alert("Failed to delete lesson") }
    }

    const handleDeleteExam = async (examId: number) => {
        if (!confirm('Are you sure you want to delete this exam?')) return
        try {
            await api.delete(`/exams/${examId}`)
            fetchSubject()
        } catch (err) { alert("Failed to delete exam") }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>
    if (!subject) return <div className="p-8 text-center text-red-500">Subject not found</div>

    return (
        <div className="space-y-6">
            <Link href="/admin/subjects" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Subjects
            </Link>

            <div className="flex justify-between items-end border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
                    <p className="text-muted-foreground mt-1 max-w-2xl">{subject.description}</p>
                </div>
            </div>

            <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="lessons">Manage Lessons</TabsTrigger>
                    <TabsTrigger value="exams">Manage Exams</TabsTrigger>
                </TabsList>

                <TabsContent value="lessons" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Lessons curriculum</h2>
                        <Link href={`/admin/lessons/editor?subjectId=${subject.id}`}>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add New Lesson</Button>
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {subject.lessons?.map((lesson: any, index: number) => (
                            <Card key={lesson.id} className="flex items-center justify-between p-4 flex-row py-3">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 text-gray-500 w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/lessons/editor?subjectId=${subject.id}&lessonId=${lesson.id}`}>
                                        <Button variant="outline" size="sm" className="h-8"><Edit2 className="w-3 h-3 mr-1" /> Edit Blocks</Button>
                                    </Link>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteLesson(lesson.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        {(!subject.lessons || subject.lessons.length === 0) && (
                            <div className="text-center p-8 bg-gray-50 border border-dashed rounded-xl text-gray-500">
                                No lessons created yet. Click the Add New Lesson button to start building your curriculum.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="exams" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Exams and Quizzes</h2>
                        <Link href={`/admin/exams/editor?subjectId=${subject.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Create Empty Exam</Button>
                        </Link>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {subject.exams?.map((exam: any) => (
                            <Card key={exam.id} className="border-blue-100 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-600" /> {exam.title}
                                    </CardTitle>
                                    <CardDescription>Duration: {exam.duration} minutes</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 flex justify-end gap-2 border-t mt-2 pt-3">
                                    <Link href={`/admin/exams/editor?subjectId=${subject.id}&examId=${exam.id}`}>
                                        <Button variant="outline" size="sm" className="h-8"><Edit2 className="w-3 h-3 mr-1" /> Edit Questions</Button>
                                    </Link>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteExam(exam.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {(!subject.exams || subject.exams.length === 0) && (
                            <div className="col-span-full text-center p-8 bg-gray-50 border border-dashed rounded-xl text-gray-500">
                                No exams created yet.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
