"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, PlayCircle } from "lucide-react"

export function HtmlSandboxBlock({ defaultHtml }: { defaultHtml: string }) {
    // Using srcDoc is safe as it runs in the iframe sandbox
    // Rendered full width for the student to interact with the visualizer directly
    return (
        <Card className="my-8 border-purple-500/30 shadow-lg shadow-purple-500/5 bg-[#12121a] overflow-hidden">
            <div className="bg-[#1a1a2e] border-b border-[#2a2a3a] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
                    <Code className="w-4 h-4" />
                    Interactive Visualization
                </div>
            </div>
            <div className="p-0 bg-transparent min-h-[500px] h-[750px] relative w-full rounded-b-xl overflow-hidden" style={{ borderRadius: '0 0 0.75rem 0.75rem' }}>
                <iframe
                    srcDoc={defaultHtml}
                    title="HTML Sandbox"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none style-none"
                    style={{ overflow: 'hidden' }}
                    scrolling="no"
                />
            </div>
        </Card>
    )
}
