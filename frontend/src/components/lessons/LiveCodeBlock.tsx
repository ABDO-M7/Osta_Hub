"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Terminal } from "lucide-react"

export function LiveCodeBlock({ defaultCode }: { defaultCode: string }) {
    const [code, setCode] = useState(defaultCode || 'console.log("Hello World!");')
    const [output, setOutput] = useState<string | null>(null)

    const runCode = () => {
        let logs: string[] = []
        const originalLog = console.log

        // Mock console.log to capture output
        console.log = (...args) => {
            logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
        }

        try {
            // Using new Function instead of eval for slightly better scoping
            const execute = new Function(code)
            execute()
            if (logs.length === 0) {
                logs.push("-- Code executed with no console output --")
            }
        } catch (err: any) {
            logs.push(`Error: ${err.message}`)
        } finally {
            // Restore original console.log
            console.log = originalLog
        }

        setOutput(logs.join('\n'))
    }

    return (
        <Card className="my-8 border-green-500/30 shadow-lg shadow-green-500/5 bg-[#12121a] overflow-hidden">
            <div className="bg-[#1a1a2e] border-b border-[#2a2a3a] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                    <Terminal className="w-4 h-4" />
                    Interactive Sandbox (JavaScript)
                </div>
                <Button size="sm" onClick={runCode} className="h-7 text-xs gap-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold">
                    <PlayCircle className="w-3.5 h-3.5" /> Run Code
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a2a3a]">
                <div className="p-0">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-48 md:h-64 p-4 bg-transparent text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-0"
                        spellCheck="false"
                    />
                </div>
                <div className="p-0 bg-[#0a0a0f]">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-[#1e1e2e] bg-[#12121a]">
                        Console Output
                    </div>
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap overflow-auto h-40 md:h-56 text-gray-300">
                        {output === null ? <span className="text-gray-600 italic">Click 'Run Code' to see output here...</span> : output}
                    </pre>
                </div>
            </div>
        </Card>
    )
}
