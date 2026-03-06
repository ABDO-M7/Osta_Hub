"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LiveCodeBlock } from "./LiveCodeBlock"
import { HtmlSandboxBlock } from "./HtmlSandboxBlock"

export function BlockRenderer({ block }: { block: any }) {
    const { type, content } = block

    switch (type) {
        case 'paragraph':
            return (
                <div className="prose prose-blue max-w-none my-6">
                    <p className="text-gray-700 leading-relaxed text-lg">{content.text}</p>
                </div>
            )

        case 'image':
            return (
                <figure className="my-8 rounded-xl overflow-hidden border bg-gray-50">
                    <img src={content.url} alt={content.alt || 'Lesson visual'} className="w-full max-h-[500px] object-contain" />
                    {content.alt && <figcaption className="p-3 text-center text-sm text-gray-500 bg-white border-t">{content.alt}</figcaption>}
                </figure>
            )



        case 'code-execution':
            return <LiveCodeBlock defaultCode={content.code} />

        case 'html-sandbox':
            return <HtmlSandboxBlock defaultHtml={content.html} />

        case 'quiz':
            return <MiniQuiz content={content} />

        default:
            return <div className="p-4 border border-dashed text-gray-400 bg-gray-50 rounded-lg my-4">Unsupported block type: {type}</div>
    }
}

function MiniQuiz({ content }: { content: any }) {
    const [selected, setSelected] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const isCorrect = selected === content.correctIndex

    return (
        <Card className="my-8 border-blue-100 shadow-sm">
            <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-900">{content.question}</h4>
                <div className="space-y-2">
                    {content.options.map((opt: string, idx: number) => {
                        let btnClass = "w-full justify-start font-normal text-left h-auto py-3 px-4 border"
                        if (submitted) {
                            if (idx === content.correctIndex) btnClass += " bg-emerald-50 border-emerald-500 text-emerald-900"
                            else if (idx === selected) btnClass += " bg-red-50 border-red-500 text-red-900"
                            else btnClass += " opacity-50"
                        } else {
                            btnClass += selected === idx ? " border-blue-500 bg-blue-50 text-blue-900" : " hover:bg-gray-50"
                        }

                        return (
                            <Button
                                key={idx}
                                variant="outline"
                                className={btnClass}
                                onClick={() => !submitted && setSelected(idx)}
                            >
                                <div className="flex w-full items-center gap-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs ${submitted && idx === content.correctIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                                        submitted && idx === selected && idx !== content.correctIndex ? 'bg-red-500 border-red-500 text-white' :
                                            selected === idx ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white text-gray-500'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="whitespace-normal break-words leading-relaxed">{opt}</span>
                                </div>
                            </Button>
                        )
                    })}
                </div>

                {!submitted && (
                    <Button
                        className="mt-6 w-full"
                        disabled={selected === null}
                        onClick={() => setSubmitted(true)}
                    >
                        Check Answer
                    </Button>
                )}

                {submitted && (
                    <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                        <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                        <div>
                            <p className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                            <p className="text-sm opacity-90">{isCorrect ? 'Great job, you nailed it.' : 'Review the content above and try again later.'}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
