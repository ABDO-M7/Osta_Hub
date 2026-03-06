"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen, Sparkles } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await api.post("/auth/register", { name, email, password })
            const { user, accessToken } = response.data
            login(user, accessToken)
            router.push("/student/dashboard")
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] p-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-2 mb-8 relative">
                <div className="bg-green-500/20 p-2 rounded-xl">
                    <BookOpen className="h-6 w-6 text-green-400" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">EduLearn</span>
                <Sparkles className="h-4 w-4 text-green-400" />
            </div>

            <Card className="w-full max-w-md relative border-[#1e1e2e] bg-[#12121a]/80 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-white">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Enter your details below to create your student account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
