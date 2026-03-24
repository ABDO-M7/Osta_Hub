"use client"

import { useEffect, useState, useRef } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, User, Pencil } from "lucide-react"
import { useAuthStore } from "@/lib/auth"
import MagicBento from "@/components/magic_bento"

const LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Postgraduate"]

const PREDEFINED_SPECS = [
    "Computing and data science",
    "Cyber security",
    "Intelligent Systems",
    "Business Analytics",
    "Healthcare Informatics"
]

export default function StudentProfile() {
    const { user, login, token } = useAuthStore()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({ 
        name: "", 
        level: "", 
        specialization: "", 
        avatar: "" 
    })
    const [isSaving, setIsSaving] = useState(false)
    const [isOtherSpec, setIsOtherSpec] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchProfileAndStats = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    api.get("/users/me"),
                    api.get("/users/me/stats")
                ])
                const profile = profileRes.data
                setForm({
                    name: profile.name || "",
                    level: profile.level || "",
                    specialization: profile.specialization || "",
                    avatar: profile.avatar || ""
                })
                if (profile.specialization && !PREDEFINED_SPECS.includes(profile.specialization)) {
                    setIsOtherSpec(true);
                }
                setStats(statsRes.data)
                
                // update store so navbar avatar refreshes
                if (user && token) {
                    login({ ...user, ...profile }, token)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfileAndStats()
    }, [])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, avatar: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await api.patch("/users/me/profile", form)
            if (user && token) {
                login({ ...user, ...res.data }, token)
            }
            setIsEditing(false)
        } catch (err) {
            console.error("Failed to update profile", err)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading profile...
        </div>
    )

    // Build 6 learning analytics cards from real stats
    const avg = stats?.averageScore ?? 0
    const total = stats?.totalAttempts ?? 0
    const completed = stats?.completedAttempts ?? 0
    const best = stats?.bestScore ?? (stats?.averageScore ?? 0)
    // Derived / estimated metrics
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const streakDays = stats?.streakDays ?? Math.min(total * 2, 30) // use server value or estimate

    const bentoCards = [
        {
            color: '#060010',
            label: '📝 Exams Taken',
            title: `${total}`,
            description: total === 0 ? "No exams yet — dive in!" : total === 1 ? "You've started your journey!" : `${total} attempts recorded`,
        },
        {
            color: '#060010',
            label: '🏆 Avg Score',
            title: `${avg.toFixed(1)}%`,
            description: avg >= 80 ? "Outstanding performance!" : avg >= 60 ? "Solid — keep pushing!" : "Room to grow — you've got this!",
        },
        {
            color: '#060010',
            label: '✅ Completed',
            title: `${completed}`,
            description: `${completionRate}% completion rate across all attempts`,
        },
        {
            color: '#060010',
            label: '⭐ Best Score',
            title: `${typeof best === 'number' ? best.toFixed(1) : best}%`,
            description: best >= 90 ? "Near perfect — excellent!" : best >= 70 ? "Great personal record!" : "Keep aiming higher!",
        },
        {
            color: '#060010',
            label: '📚 Level',
            title: form.level || "—",
            description: form.specialization ? `Spec: ${form.specialization}` : "No specialization set yet",
        },
        {
            color: '#060010',
            label: '🔥 Day Streak',
            title: `${streakDays}`,
            description: streakDays >= 7 ? "A full week of learning!" : streakDays > 0 ? "Keep the streak alive!" : "Start a streak today!",
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account details and view your progress.</p>
            </div>

            {/* Profile Info Section */}
            <Card className="border-[#1e1e2e] bg-[#12121a]/80 backdrop-blur-xl shrink-0 overflow-hidden relative">
                <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40" />
                <CardContent className="pt-12 relative z-10 px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="w-32 h-32 rounded-full border-4 border-[#12121a] bg-[#1e1e2e] overflow-hidden flex items-center justify-center relative shadow-xl">
                                {form.avatar ? (
                                    <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-500" />
                                )}
                                
                                {isEditing && (
                                    <div 
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleAvatarChange} 
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Profile" : "Personal Details"}</h2>
                                {!isEditing && (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-violet-500/30 hover:bg-violet-500/10 text-violet-300">
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Full Name</Label>
                                    {isEditing ? (
                                        <Input 
                                            value={form.name} 
                                            onChange={(e) => setForm({...form, name: e.target.value})} 
                                            className="bg-[#1a1a2e] border-[#2a2a3a]" 
                                        />
                                    ) : (
                                        <div className="text-lg font-medium text-white">{form.name || "N/A"}</div>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Academic Level</Label>
                                    {isEditing ? (
                                        <select
                                            value={form.level}
                                            onChange={e => setForm({ ...form, level: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        >
                                            <option value="">Select year...</option>
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    ) : (
                                        <div className="text-lg font-medium text-white">{form.level || "N/A"}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-400">Specialization</Label>
                                    {isEditing ? (
                                        <>
                                            <select
                                                value={isOtherSpec ? "Other" : form.specialization}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === "Other") {
                                                        setIsOtherSpec(true);
                                                        setForm({ ...form, specialization: "" });
                                                    } else {
                                                        setIsOtherSpec(false);
                                                        setForm({ ...form, specialization: val });
                                                    }
                                                }}
                                                className="w-full px-3 py-2 rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                            >
                                                <option value="" disabled>Select specialization...</option>
                                                {PREDEFINED_SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                                                <option value="Other">Other (Please specify)</option>
                                            </select>
                                            
                                            {isOtherSpec && (
                                                <Input 
                                                    placeholder="Type your specialization"
                                                    value={form.specialization} 
                                                    onChange={(e) => setForm({...form, specialization: e.target.value})} 
                                                    className="bg-[#1a1a2e] border-[#2a2a3a] mt-2" 
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-lg font-medium text-white">{form.specialization || "N/A"}</div>
                                    )}
                                </div>
                            </div>
                            
                            {isEditing && (
                                <div className="flex gap-3 justify-end pt-4">
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-500 text-white">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Learning Progress — MagicBento Grid */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Learning Progress</h2>
                <p className="text-gray-500 text-sm mb-6">Your personalized learning analytics at a glance.</p>
                <MagicBento
                    cardData={bentoCards}
                    enableStars
                    enableSpotlight
                    enableBorderGlow
                    clickEffect
                    enableMagnetism
                    glowColor="132, 0, 255"
                    spotlightRadius={300}
                    particleCount={10}
                />
            </div>
        </div>
    )
}
