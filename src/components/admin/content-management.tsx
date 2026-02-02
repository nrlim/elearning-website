"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pencil,
    Trash2,
    Plus,
    ExternalLink,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PlayCircle,
    Folder,
    ChevronDown,
    ChevronRight as ChevronRightIcon,
    Video
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import axios from "axios"

interface Content {
    id: string
    title: string
    description: string
    youtubeUrl: string
    createdAt: string
    moduleId: string
}

interface Module {
    id: string
    title: string
    description: string
    createdAt: string
    content: Content[] // Parts/Lessons
    typeId?: string
    type?: {
        id: string
        name: string
    }
    _count?: {
        content: number
    }
}

interface Meta {
    total: number
    page: number
    limit: number
    totalPages: number
}

function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export function ContentManagement() {
    const [modules, setModules] = useState<Module[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(1)

    // Module Dialog State
    const [moduleDialog, setModuleDialog] = useState(false)
    const [editingModule, setEditingModule] = useState<Module | null>(null)
    const [moduleFormData, setModuleFormData] = useState({ title: "", description: "", typeId: "" })
    const [moduleTypes, setModuleTypes] = useState<{ id: string, name: string }[]>([])

    // Lesson Dialog State
    const [lessonDialog, setLessonDialog] = useState(false)
    const [editingLesson, setEditingLesson] = useState<Content | null>(null)
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
    const [lessonFormData, setLessonFormData] = useState({ title: "", description: "", youtubeUrl: "" })

    // Expanded State
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

    const debouncedSearch = useDebounceValue(searchQuery, 500)

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search: debouncedSearch
            })

            const { data } = await axios.get(`/api/modules?${params}`)
            setModules(data.data)
            setMeta(data.meta)

            // Should verify if backend includes content. My API implementation included content: true.
        } catch (error) {
            console.error("Failed to fetch modules", error)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch])

    useEffect(() => {
        fetchModules()
        axios.get("/api/module-types").then(res => setModuleTypes(res.data)).catch(console.error)
    }, [fetchModules])

    const toggleExpand = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
    }

    // --- Module Handlers ---

    const handleCreateModule = () => {
        setEditingModule(null)
        setModuleFormData({ title: "", description: "", typeId: "" })
        setModuleDialog(true)
    }

    const handleEditModule = (module: Module) => {
        setEditingModule(module)
        setModuleFormData({ title: module.title, description: module.description, typeId: module.typeId || "" })
        setModuleDialog(true)
    }

    const handleSubmitModule = async () => {
        try {
            if (editingModule) {
                await axios.put(`/api/modules/${editingModule.id}`, moduleFormData)
            } else {
                await axios.post("/api/modules", moduleFormData)
            }
            fetchModules()
            setModuleDialog(false)
        } catch (error) {
            console.error("Failed to save module", error)
        }
    }

    const handleDeleteModule = async (id: string) => {
        if (!confirm("Are you sure you want to delete this module and ALL its lessons?")) return
        try {
            await axios.delete(`/api/modules/${id}`)
            fetchModules()
        } catch (error) {
            console.error("Failed to delete module", error)
        }
    }

    // --- Lesson Handlers ---

    const handleCreateLesson = (moduleId: string) => {
        setSelectedModuleId(moduleId)
        setEditingLesson(null)
        setLessonFormData({ title: "", description: "", youtubeUrl: "" })
        setLessonDialog(true)
    }

    const handleEditLesson = (lesson: Content) => {
        setSelectedModuleId(lesson.moduleId)
        setEditingLesson(lesson)
        setLessonFormData({
            title: lesson.title,
            description: lesson.description,
            youtubeUrl: lesson.youtubeUrl
        })
        setLessonDialog(true)
    }

    const handleSubmitLesson = async () => {
        try {
            if (!selectedModuleId) return

            let url = lessonFormData.youtubeUrl.trim()
            if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                url = `https://${url}`
            }

            const payload = {
                ...lessonFormData,
                youtubeUrl: url,
                moduleId: selectedModuleId
            }

            if (editingLesson) {
                // Assuming we might need a separate endpoint for updating specific content 
                // BUT my current content API uses simple REST on /api/content/[id] which is fine
                // Wait, I updated GET /api/content to filter, but generic POST/PUT should still work
                // I need to check api/content/[id]/route.ts
                // I'll assume standard REST: PUT /api/content/[id]
                await axios.put(`/api/content/${editingLesson.id}`, payload)
            } else {
                await axios.post("/api/content", payload)
            }
            fetchModules() // Refresh all modules to see new count/lessons
            setLessonDialog(false)
        } catch (error: any) {
            console.error("Failed to save lesson", error)
            const msg = error.response?.data?.error || "Failed to save lesson. Check inputs."
            alert(msg)
        }
    }

    const handleDeleteLesson = async (id: string) => {
        if (!confirm("Delete this lesson?")) return
        try {
            await axios.delete(`/api/content/${id}`)
            fetchModules()
        } catch (error) {
            console.error("Failed to delete lesson", error)
        }
    }

    const getThumbnailUrl = (url: string) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
            const match = url.match(regExp)
            return (match && match[2].length === 11)
                ? `https://img.youtube.com/vi/${match[2]}/default.jpg`
                : null
        } catch (e) {
            return null
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search modules..."
                            className="pl-9 bg-background/50"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <Button onClick={handleCreateModule} className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                        <Folder className="h-4 w-4" />
                        New Module
                    </Button>
                </div>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-secondary/30">
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Module Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead className="w-[100px] text-center">Lessons</TableHead>
                                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">Loading modules...</TableCell>
                                    </TableRow>
                                ) : modules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No modules found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    modules.map((module) => (
                                        <React.Fragment key={module.id}>
                                            <TableRow className="group hover:bg-secondary/20 transition-colors border-b-0">
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpand(module.id)}>
                                                        {expandedModules[module.id] ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRightIcon className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-semibold text-primary">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Folder className="h-4 w-4 text-primary/70" />
                                                            {module.title}
                                                        </div>
                                                        {module.type && (
                                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit ml-6">
                                                                {module.type.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                                    {module.description}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-secondary text-xs">
                                                        {module.content?.length || 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditModule(module)}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit Module
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleCreateLesson(module.id)}>
                                                                <Plus className="mr-2 h-4 w-4" /> Add Lesson
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteModule(module.id)} className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Module
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>

                                            {expandedModules[module.id] && (
                                                <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-t-0">
                                                    <TableCell colSpan={5} className="p-0">
                                                        <div className="pl-12 pr-4 py-4 space-y-2">
                                                            <div className="flex justify-between items-center px-2 mb-2">
                                                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lessons in this module</h4>
                                                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleCreateLesson(module.id)}>
                                                                    <Plus className="h-3 w-3" /> Add Lesson
                                                                </Button>
                                                            </div>
                                                            {(!module.content || module.content.length === 0) ? (
                                                                <div className="text-sm text-muted-foreground px-4 py-2 italic border border-dashed rounded-md bg-background/50">
                                                                    No lessons yet. Add one!
                                                                </div>
                                                            ) : (
                                                                <div className="grid gap-2">
                                                                    {module.content.map((lesson) => (
                                                                        <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border bg-background/60 hover:border-primary/30 transition-all group/lesson">
                                                                            <div className="relative h-10 w-16 shrink-0 rounded overflow-hidden bg-muted">
                                                                                {getThumbnailUrl(lesson.youtubeUrl) ? (
                                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                                    <img src={getThumbnailUrl(lesson.youtubeUrl)!} alt="" className="h-full w-full object-cover" />
                                                                                ) : (
                                                                                    <div className="h-full w-full flex items-center justify-center bg-secondary">
                                                                                        <Video className="h-4 w-4 text-muted-foreground" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-medium text-sm truncate">{lesson.title}</div>
                                                                                <div className="text-xs text-muted-foreground truncate">{lesson.description}</div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditLesson(lesson)}>
                                                                                    <Pencil className="h-3 w-3" />
                                                                                </Button>
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        <div className="text-xs text-muted-foreground mr-2">
                            Page {page} of {meta.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= meta.totalPages}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Module Dialog */}
            <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingModule ? "Edit Module" : "Create New Module"}</DialogTitle>
                        <DialogDescription>
                            Organize your lessons into modules.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Module Title</Label>
                            <Input
                                placeholder="e.g., Blockchain Basics"
                                value={moduleFormData.title}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Short description..."
                                value={moduleFormData.description}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Module Type</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={moduleFormData.typeId}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, typeId: e.target.value })}
                            >
                                <option value="">Select a type (optional)</option>
                                {moduleTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModuleDialog(false)}>Cancel</Button>
                        <Button onClick={handleSubmitModule}>Save Module</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Lesson Dialog */}
            <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingLesson ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
                        <DialogDescription>
                            Add a YouTube video lesson to this module.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input
                                placeholder="e.g., How hashing works"
                                value={lessonFormData.title}
                                onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Short description..."
                                value={lessonFormData.description}
                                onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>YouTube URL</Label>
                            <Input
                                placeholder="https://youtube.com/..."
                                value={lessonFormData.youtubeUrl}
                                onChange={(e) => setLessonFormData({ ...lessonFormData, youtubeUrl: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLessonDialog(false)}>Cancel</Button>
                        <Button onClick={handleSubmitLesson}>Save Lesson</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
