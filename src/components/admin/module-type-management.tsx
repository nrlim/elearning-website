"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
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
import { Pencil, Trash2, Plus, Tags } from "lucide-react"
import axios from "axios"

interface ModuleType {
    id: string
    name: string
    description: string
    createdAt: string
    discordRoleMappings?: {
        discordRoleId: string
    }[]
    isAio: boolean
}

export function ModuleTypeManagement() {
    const [types, setTypes] = useState<ModuleType[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingType, setEditingType] = useState<ModuleType | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "", discordRoleId: "", isAio: false })

    const fetchTypes = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/module-types")
            setTypes(data)
        } catch (error) {
            console.error("Failed to fetch types")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    const handleCreate = () => {
        setEditingType(null)
        setFormData({ name: "", description: "", discordRoleId: "", isAio: false })
        setDialogOpen(true)
    }

    const handleEdit = (type: ModuleType) => {
        setEditingType(type)
        setFormData({
            name: type.name,
            description: type.description,
            discordRoleId: type.discordRoleMappings?.[0]?.discordRoleId || "",
            isAio: type.isAio || false
        })
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect modules using this type.")) return
        try {
            await axios.delete(`/api/module-types/${id}`)
            fetchTypes()
        } catch (error) {
            console.error("Failed to delete")
        }
    }

    const handleSubmit = async () => {
        try {
            if (editingType) {
                await axios.put(`/api/module-types/${editingType.id}`, formData)
            } else {
                await axios.post("/api/module-types", formData)
            }
            fetchTypes()
            setDialogOpen(false)
        } catch (error) {
            console.error("Failed to save")
            alert("Failed to save. Name or Discord Role ID might be non-unique.")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Module Types Integration</h2>
                <Button onClick={handleCreate} className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white">
                    <Plus className="h-4 w-4" /> Add Type
                </Button>
            </div>

            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="text-slate-300">Name</TableHead>
                                    <TableHead className="text-slate-300">Description</TableHead>
                                    <TableHead className="text-slate-300">Discord Role ID</TableHead>
                                    <TableHead className="text-right text-slate-300">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={4} className="text-center h-24 text-slate-400">Loading...</TableCell>
                                    </TableRow>
                                ) : types.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={4} className="text-center h-24 text-slate-500">No types found.</TableCell>
                                    </TableRow>
                                ) : (
                                    types.map((type) => (
                                        <TableRow key={type.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                            <TableCell className="font-medium text-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <Tags className="h-4 w-4 text-indigo-400" />
                                                    {type.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400">{type.description}</TableCell>
                                            <TableCell>
                                                {type.discordRoleMappings?.[0] ? (
                                                    <code className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                                                        {type.discordRoleMappings[0].discordRoleId}
                                                    </code>
                                                ) : (
                                                    <span className="text-slate-600 text-xs italic">No Role Linked</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {type.isAio && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs border border-yellow-500/20 mr-2">
                                                        Access All Areas (AIO)
                                                    </span>
                                                )}
                                                <div className="flex justify-end gap-2 inline-flex">
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/10 text-slate-400" onClick={() => handleEdit(type)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-red-500/10 text-red-500/70 hover:text-red-500" onClick={() => handleDelete(type.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            {editingType ? "Edit Module Type Mapping" : "Create New Module Type"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400">Name (e.g., Akademi Crypto)</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Type Name"
                                className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400">Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Description (optional)"
                                className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-indigo-400 font-semibold flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.0766.1363-.1625.321-.2235.4661a18.2736 18.2736 0 00-5.445 0c-.061-.1451-.1469-.3298-.2235-.4661a19.7432 19.7432 0 00-4.8851 1.5152c-3.111 4.6467-3.968 9.1724-3.548 13.6231a20.026 20.026 0 006.0123 3.0336c.4566-.6225.8601-1.2952 1.2014-2.007a13.3444 13.3444 0 01-1.9213-.913c.1625-.119.3193-.242.4704-.3696 3.705 1.71 7.7416 1.71 11.411 0 .1511.1276.3079.2506.4704.3696a13.1906 13.1906 0 01-1.9213.913c.3413.7118.7448 1.3845 1.2014 2.007a20.0347 20.0347 0 006.0123-3.0336c.4912-5.1818-.8486-9.664-3.548-13.6231zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z" /></svg>
                                Discord Role ID
                            </Label>
                            <Input
                                value={formData.discordRoleId}
                                onChange={(e) => setFormData({ ...formData, discordRoleId: e.target.value })}
                                placeholder="Paste Role ID Here (Right click role in Discord > Copy ID)"
                                className="bg-white/5 border-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-500 italic">User with this role in Discord will automatically see modules of this type.</p>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isAio"
                                    checked={formData.isAio}
                                    onChange={(e) => setFormData({ ...formData, isAio: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-white/5 border-white/10"
                                />
                                <Label htmlFor="isAio" className="text-slate-300 font-medium cursor-pointer">
                                    Enable Universal Access (AIO)
                                </Label>
                            </div>
                            <p className="text-[11px] text-yellow-500/80 leading-snug">
                                ⚠️ If enabled, users with this module type (via Role or Manual Assign) will bypass all restrictions and can view <strong>ALL modules</strong> in the system.
                                Useful for VIP/AIO roles.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="hover:bg-white/5 text-slate-300" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8">Save Mapping</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
