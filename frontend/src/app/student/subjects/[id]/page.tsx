"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, PlayCircle } from "lucide-react"

export default function SubjectPage() {
    const params = useParams()
    const id = params?.id
    const [subject, setSubject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
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
        fetchSubject()
    }, [id])

    if (loading) return <div className="p-8 text-center text-gray-500">Loading subject...</div>
    if (!subject) return <div className="p-8 text-center text-red-500">Subject not found</div>

    return (
        <div className="space-y-6">
            <div
                className="h-64 w-full bg-cover bg-center rounded-xl relative overflow-hidden"
                style={{ backgroundImage: `url(${subject.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200'})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h1 className="text-4xl font-bold tracking-tight">{subject.name}</h1>
                    <p className="mt-2 text-lg text-gray-200 max-w-2xl">{subject.description}</p>
                </div>
            </div>

            <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="w-full max-w-md grid w-full grid-cols-2">
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                </TabsList>

                <TabsContent value="lessons" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {subject.lessons?.map((lesson: any, index: number) => (
                            <Card key={lesson.id} className="flex flex-col">
                                <CardHeader>
                                    <CardDescription>Lesson {index + 1}</CardDescription>
                                    <CardTitle>{lesson.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="mt-auto pt-4">
                                    <Link href={`/student/lessons/${lesson.id}`}>
                                        <Button className="w-full gap-2">
                                            <BookOpen className="h-4 w-4" /> Start Lesson
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                        {(!subject.lessons || subject.lessons.length === 0) && (
                            <div className="col-span-full text-center p-8 bg-[#12121a] border border-[#1e1e2e] rounded-xl text-gray-500">
                                No lessons available for this subject yet.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="exams" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {subject.exams?.map((exam: any) => (
                            <Card key={exam.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-green-400" />
                                        {exam.title}
                                    </CardTitle>
                                    <CardDescription>{exam.duration} minutes</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto pt-4">
                                    <Link href={`/student/exams/${exam.id}`}>
                                        <Button variant="default" className="w-full gap-2">
                                            <PlayCircle className="h-4 w-4" /> Start Exam
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                        {(!subject.exams || subject.exams.length === 0) && (
                            <div className="col-span-full text-center p-8 bg-[#12121a] border border-[#1e1e2e] rounded-xl text-gray-500">
                                No exams available for this subject yet.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
