"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, PlayCircle, Search } from "lucide-react"

export default function SubjectPage() {
    const params = useParams()
    const id = params?.id
    const [subject, setSubject] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [searchTopic, setSearchTopic] = useState("")

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

    const filteredLessons = subject.lessons?.filter((l: any) => {
        if (!searchTopic) return true;
        const s = searchTopic.toLowerCase();
        return l.title.toLowerCase().includes(s) || (l.topics || []).some((t: string) => t.toLowerCase().includes(s));
    }) || [];

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
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">Course Lessons</h3>
                        {subject.lessons?.length > 0 && (
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search topic or title..." 
                                    value={searchTopic}
                                    onChange={e => setSearchTopic(e.target.value)}
                                    className="w-full bg-[#12121a] border border-[#2a2a3a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredLessons.map((lesson: any, index: number) => (
                            <Card key={lesson.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-1">
                                        <CardDescription>Lesson {subject.lessons.findIndex((l:any) => l.id === lesson.id) + 1}</CardDescription>
                                    </div>
                                    <div className="flex gap-1.5 mb-2 mt-1 flex-wrap">
                                        {(lesson.topics || []).map((t: string) => (
                                            <span key={t} className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold tracking-wider uppercase">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
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
                        {subject.lessons?.length > 0 && filteredLessons.length === 0 && (
                            <div className="col-span-full text-center p-8 text-gray-500">
                                No lessons match your topic search.
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
