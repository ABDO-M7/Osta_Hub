"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { BlockRenderer } from "@/components/lessons/BlockRenderer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Edit3, Loader2, Save } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id
    const [lesson, setLesson] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAdvanced, setShowAdvanced] = useState(true)

    // Progress and Notes State
    const [isCompleted, setIsCompleted] = useState(false)
    const [completing, setCompleting] = useState(false)
    const [noteContent, setNoteContent] = useState("")
    const [savingNote, setSavingNote] = useState(false)
    const [notesOpen, setNotesOpen] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (!id) return
        const fetchLessonData = async () => {
            try {
                // Fetch lesson and existing notes concurrently
                const [res, noteRes] = await Promise.all([
                    api.get(`/lessons/${id}`),
                    api.get(`/lessons/${id}/notes`).catch(() => ({ data: { content: "" } })) // Ignore 404 if notes not found
                ])
                setLesson(res.data)
                setNoteContent(noteRes.data?.content || "")
            } catch (err) {
                console.error("Failed to fetch lesson data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLessonData()
    }, [id])

    const handleMarkComplete = async () => {
        setCompleting(true)
        try {
            await api.post(`/lessons/${id}/complete`)
            setIsCompleted(true)
        } catch (err) {
            console.error("Failed to mark complete", err)
        } finally {
            setCompleting(false)
        }
    }

    const handleSaveNote = async () => {
        setSavingNote(true)
        setSaveSuccess(false)
        try {
            await api.post(`/lessons/${id}/notes`, { content: noteContent })
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            console.error("Failed to save note", err)
        } finally {
            setSavingNote(false)
        }
    }

    if (loading) return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading lesson material...
        </div>
    )

    if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found</div>

    return (
        <div className="max-w-3xl mx-auto pb-32 relative min-h-screen">
            {/* Absolute overlay to override the layout's global unsplash background explicitly for lessons */}
            <div className="fixed inset-0 bg-black -z-10" />
            <style dangerouslySetInnerHTML={{ __html: 'body { background: #000 !important; }' }} />
            <Link href={`/student/subjects/${lesson.subjectId}`} className="inline-flex items-center text-sm font-medium text-violet-400 hover:text-violet-300 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to {lesson.subject?.name || 'Subject'}
            </Link>

            <header className="mb-10 border-b border-white/10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold tracking-wider uppercase text-gray-500 mb-2">Lesson {lesson.order}</div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">{lesson.title}</h1>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-[#1e1e2e]/50 px-4 py-2.5 rounded-full border border-white/5 shadow-inner">
                        <span className="text-sm text-gray-400 font-medium select-none">Show Advanced</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={showAdvanced} onChange={e => setShowAdvanced(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                    </div>
                </div>
            </header>

            <div className="space-y-4">
                {(() => {
                    let blocksToRender = lesson.blocks || [];
                    if (!showAdvanced) {
                        blocksToRender = blocksToRender.filter((b: any) => !b.content?.isAdvanced);
                    }

                    if (blocksToRender.length === 0) {
                        return (
                            <div className="p-12 border-2 border-dashed border-white/10 rounded-xl text-center text-gray-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>This lesson has no content blocks yet (or all advanced content is hidden).</p>
                            </div>
                        )
                    }

                    const groups: any[] = [];
                    let currentGroup: any = { type: 'root', items: [] };
                    
                    blocksToRender.forEach((block: any) => {
                        if (block.type === 'section') {
                            if (currentGroup.type !== 'root' || currentGroup.items.length > 0) {
                                groups.push(currentGroup);
                            }
                            currentGroup = { type: 'section', title: block.content.title, items: [] };
                        } else {
                            currentGroup.items.push(block);
                        }
                    });
                    if (currentGroup.items.length > 0 || currentGroup.type === 'section') {
                        groups.push(currentGroup);
                    }

                    return groups.map((group, gIdx) => {
                        if (group.type === 'root') {
                            return (
                                <div key={`root-${gIdx}`} className="space-y-4">
                                    {group.items.map((block: any, idx: number) => <BlockRenderer key={block.id || idx} block={block} />)}
                                </div>
                            )
                        } else {
                            return (
                                <Accordion key={`sec-${gIdx}`} type="single" collapsible className="w-full mb-6 border border-white/10 rounded-xl overflow-hidden bg-[#1e1e2e]/40 shadow-xl backdrop-blur-md">
                                    <AccordionItem value={`item-${gIdx}`} className="border-none">
                                        <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/5 data-[state=open]:bg-white/5 transition-colors group">
                                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 group-hover:from-violet-300 group-hover:to-indigo-300">
                                                {group.title || 'Section'}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 py-4 bg-[#0a0a10]/50 border-t border-white/5">
                                            <div className="space-y-4 pt-2">
                                                {group.items.length > 0 ? (
                                                    group.items.map((block: any, idx: number) => <BlockRenderer key={block.id || idx} block={block} />)
                                                ) : (
                                                    <div className="text-gray-500 italic text-sm">Empty section</div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )
                        }
                    });
                })()}
            </div>

            {/* Bottom Actions */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                <Button 
                    variant={isCompleted ? "default" : "outline"}
                    className={isCompleted ? "bg-green-600 hover:bg-green-700 text-white border-none" : "border-violet-500/30 text-violet-300 hover:bg-violet-500/10"}
                    onClick={handleMarkComplete}
                    disabled={isCompleted || completing}
                >
                    {completing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isCompleted ? "Completed" : "Mark as Complete"}
                    <CheckCircle2 className={`h-4 w-4 ml-2 ${isCompleted ? 'text-white' : 'text-violet-400'}`} />
                </Button>
                
                <Link href={`/student/subjects/${lesson.subjectId}`}>
                    <Button className="bg-white text-black hover:bg-gray-200">
                        Back to Courses <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Floating Action Button for Notes */}
            <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
                <SheetTrigger asChild>
                    <button className="fixed bottom-8 right-8 z-50 p-4 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-[0_8px_30px_rgba(132,0,255,0.4)] transition-transform hover:scale-105 active:scale-95 group">
                        <Edit3 className="w-6 h-6" />
                        <span className="sr-only">Open Notes</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[500px] border-l border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl p-0 flex flex-col">
                    <SheetHeader className="p-6 border-b border-white/10">
                        <SheetTitle className="text-2xl font-bold text-white flex items-center">
                            <Edit3 className="w-5 h-5 mr-3 text-violet-400" />
                            My Notes
                        </SheetTitle>
                        <SheetDescription className="text-gray-400">
                            Capture your thoughts and key takeaways for this lesson. Saved automatically to your profile.
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="flex-1 p-6 flex flex-col relative">
                        <Textarea 
                            placeholder="Type your notes here... Markdown is supported by you in the future! :)"
                            className="flex-1 resize-none bg-black/40 border-white/10 text-white p-4 text-base leading-relaxed focus-visible:ring-violet-500 rounded-xl"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                        />
                        
                        <div className="mt-6 flex items-center justify-between">
                            <span className={`text-sm tracking-wide ${saveSuccess ? 'text-green-400' : 'text-transparent'} transition-colors`}>
                                Note saved successfully!
                            </span>
                            <Button 
                                onClick={handleSaveNote} 
                                disabled={savingNote}
                                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6"
                            >
                                {savingNote ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" /> Save Notes</>
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div >
    )
}
