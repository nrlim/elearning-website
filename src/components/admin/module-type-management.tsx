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
}

export function ModuleTypeManagement() {
    const [types, setTypes] = useState<ModuleType[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingType, setEditingType] = useState<ModuleType | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "" })

    const fetchTypes = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/module-types")
            setTypes(data)
        } catch (error) {
            console.error("Failed to fetch types", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    const handleCreate = () => {
        setEditingType(null)
        setFormData({ name: "", description: "" })
        setDialogOpen(true)
    }

    const handleEdit = (type: ModuleType) => {
        setEditingType(type)
        setFormData({ name: type.name, description: type.description })
        setDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect modules using this type.")) return
        try {
            await axios.delete(`/api/module-types/${id}`)
            fetchTypes()
        } catch (error) {
            console.error("Failed to delete", error)
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
            console.error("Failed to save", error)
            alert("Failed to save. Name might be non-unique.")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Module Types</h2>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Type
                </Button>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-secondary/30">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">Loading...</TableCell>
                                </TableRow>
                            ) : types.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No types found.</TableCell>
                                </TableRow>
                            ) : (
                                types.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Tags className="h-4 w-4 text-primary" />
                                                {type.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{type.description}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(type.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingType ? "Edit Type" : "Create Type"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name (e.g., AC, SULI, KJO)</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Type Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Description (optional)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
