"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newSubject, setNewSubject] = useState({ name: '', description: '', imageUrl: '', tracks: '' })

    const fetchSubjects = async () => {
        try {
            const res = await api.get("/subjects")
            setSubjects(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubjects()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                ...newSubject,
                tracks: newSubject.tracks ? newSubject.tracks.split(',').map(t => t.trim()).filter(Boolean) : []
            }
            await api.post("/subjects", payload)
            setIsCreating(false)
            setNewSubject({ name: '', description: '', imageUrl: '', tracks: '' })
            fetchSubjects()
        } catch (err) {
            alert("Failed to create subject")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subject? All associated lessons and exams will also be deleted.')) return
        try {
            await api.delete(`/subjects/${id}`)
            fetchSubjects()
        } catch (err) {
            alert("Failed to delete subject")
        }
    }

    const handleUpdateOrder = async (id: number, order: number) => {
        try {
            await api.put(`/subjects/${id}`, { order })
            fetchSubjects()
        } catch (err) {
            alert("Failed to update order")
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading subjects...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Subjects</h1>
                    <p className="text-muted-foreground mt-1">Create and manage content categories.</p>
                </div>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Subject</>}
                </Button>
            </div>

            {isCreating && (
                <Card className="bg-blue-50/30 border-blue-100">
                    <CardHeader>
                        <CardTitle>Create New Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
                            <div className="space-y-2">
                                <Label>Subject Name</Label>
                                <Input required value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="e.g. Advanced Mathematics" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input value={newSubject.description} onChange={e => setNewSubject({ ...newSubject, description: e.target.value })} placeholder="Short description of the curriculum..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Cover Image URL (optional)</Label>
                                <Input value={newSubject.imageUrl} onChange={e => setNewSubject({ ...newSubject, imageUrl: e.target.value })} placeholder="https://unsplash.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Associated Tracks (comma-separated)</Label>
                                <Input value={newSubject.tracks} onChange={e => setNewSubject({ ...newSubject, tracks: e.target.value })} placeholder="Machine Learning, Security, Design" />
                            </div>
                            <Button type="submit">Save Subject</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <Card key={subject.id} className="flex flex-col">
                        <div
                            className="h-32 w-full bg-cover bg-center rounded-t-xl"
                            style={{ backgroundImage: `url(${subject.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'})` }}
                        />
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <CardTitle className="mb-1.5">{subject.name}</CardTitle>
                                    {subject.tracks && subject.tracks.length > 0 && (
                                        <div className="flex gap-1 mb-1 flex-wrap">
                                            {subject.tracks.map((t: string) => (
                                                <span key={t} className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] text-blue-600 font-medium tracking-wide">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <Label className="text-[10px] text-gray-500 uppercase tracking-wider">Order</Label>
                                    <Input 
                                        type="number" 
                                        className="h-7 w-16 px-2 text-xs text-center font-mono placeholder:text-gray-300" 
                                        defaultValue={subject.order || 0}
                                        onBlur={(e) => handleUpdateOrder(subject.id, parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex gap-4 mt-2">
                                <span>{subject._count?.lessons || 0} Lessons</span>
                                <span>{subject._count?.exams || 0} Exams</span>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto pt-2 flex justify-between border-t gap-2">
                            <Link href={`/admin/subjects/${subject.id}`} className="flex-1">
                                <Button variant="outline" className="w-full h-8 text-xs"><Edit2 className="w-3 h-3 mr-1" /> Edit Content</Button>
                            </Link>
                            <Button variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(subject.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
