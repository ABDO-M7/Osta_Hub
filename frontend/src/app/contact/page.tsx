"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail, Facebook, MessageCircle } from "lucide-react"

export default function ContactPage() {
    const contacts = [
        {
            name: "LinkedIn",
            label: "Connect with me",
            url: "https://www.linkedin.com/in/abdelrahman-mostafa-cs/",
            icon: Linkedin,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/50"
        },
        {
            name: "Gmail",
            label: "Send me an email",
            url: "mailto:abdo.mostafa.cs@gmail.com",
            icon: Mail,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "group-hover:border-rose-500/50"
        },
        {
            name: "Facebook",
            label: "Find me on Facebook",
            url: "https://www.facebook.com/abdelrahman.mostafa.874695",
            icon: Facebook,
            color: "text-blue-500",
            bg: "bg-blue-600/10",
            border: "group-hover:border-blue-600/50"
        },
        {
            name: "WhatsApp",
            label: "Message me on WhatsApp",
            url: "https://wa.me/201050266177",
            icon: MessageCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "group-hover:border-emerald-500/50"
        }
    ]

    return (
        <main className="min-h-screen relative overflow-hidden pt-20 pb-32 flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
                        Get in Touch
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto text-gray-400 leading-relaxed">
                        Have a question, feedback, or want to collaborate? Feel free to reach out through any of the platforms below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
                    {contacts.map((contact) => (
                        <a key={contact.name} href={contact.url} target="_blank" rel="noopener noreferrer" className="group">
                            <Card className={`h-full border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 ${contact.border}`}>
                                <CardContent className="p-6 flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl ${contact.bg} transition-transform duration-300 group-hover:scale-110`}>
                                        <contact.icon className={`w-8 h-8 ${contact.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{contact.name}</h3>
                                        <p className="text-gray-400 text-sm">{contact.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
            </div>
        </main>
    )
}
