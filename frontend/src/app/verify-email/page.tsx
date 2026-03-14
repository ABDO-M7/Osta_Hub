"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

function VerifyEmailLogic() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, token, isAuthenticated, login } = useAuthStore()

    const [status, setStatus] = useState<"IDLE" | "VERIFYING" | "SUCCESS" | "FAILED">("IDLE")
    const [isResendLoading, setIsResendLoading] = useState(false)
    const [resendStatus, setResendStatus] = useState("")

    useEffect(() => {
        const verifyToken = searchParams.get("token")
        if (verifyToken && status === "IDLE") {
            handleVerify(verifyToken)
        }
    }, [searchParams])

    const handleVerify = async (verifyToken: string) => {
        setStatus("VERIFYING")
        try {
            await api.get(`/auth/verify-email?token=${verifyToken}`)
            setStatus("SUCCESS")
            
            // Update local user state
            if (user && token) {
                login({ ...user, emailVerified: true }, token)
            }
            
            setTimeout(() => {
                router.replace("/student/dashboard")
            }, 3000)
        } catch (err) {
            setStatus("FAILED")
        }
    }

    const handleResend = async () => {
        setIsResendLoading(true)
        setResendStatus("")
        try {
            await api.post("/auth/send-verification")
            setResendStatus("Email sent! Check your inbox.")
        } catch (err: any) {
            setResendStatus(err.response?.data?.message || "Failed to send email.")
        } finally {
            setIsResendLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center p-6 text-center">
                <p className="text-gray-400">Please log in to verify your email.</p>
                <Button className="mt-4" onClick={() => router.push("/login")}>Go to Login</Button>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-md border-[#1e1e2e] bg-[#12121a]/80 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto bg-violet-500/20 p-4 rounded-full w-fit">
                    {status === "SUCCESS" ? (
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    ) : status === "FAILED" ? (
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    ) : (
                        <Mail className="h-10 w-10 text-violet-400" />
                    )}
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                    {status === "SUCCESS" ? "Email Verified!" : status === "VERIFYING" ? "Verifying..." : "Verify your email"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                    {status === "SUCCESS" ? (
                        "Redirecting you to the dashboard..."
                    ) : status === "FAILED" ? (
                        "The verification link is invalid or has expired."
                    ) : (
                        `We sent a verification link to ${user?.email}. Please check your inbox and click the link to activate your account.`
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4 pb-8">
                {status !== "SUCCESS" && status !== "VERIFYING" && (
                    <div className="flex flex-col items-center w-full gap-2">
                        <Button 
                            variant="outline" 
                            className="w-full bg-transparent border-white/10 text-white hover:bg-white/5"
                            onClick={handleResend}
                            disabled={isResendLoading}
                        >
                            {isResendLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isResendLoading ? "Sending..." : "Resend Verification Email"}
                        </Button>
                        {resendStatus && (
                            <p className="text-sm text-green-400 mt-2">{resendStatus}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] p-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/8 blur-[120px] rounded-full pointer-events-none" />
            <Suspense>
                <VerifyEmailLogic />
            </Suspense>
        </div>
    )
}
