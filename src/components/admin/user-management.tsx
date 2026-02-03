"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { siteConfig } from "@/config/site-config"
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
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Eye, EyeOff, FileDown } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"

interface User {
    id: string
    name: string
    email: string
    role: "USER" | "ADMIN" | "SUPERADMIN"
    createdAt: string
    moduleTypes?: { id: string; name: string }[]
    status: "ACTIVE" | "INACTIVE"
    isTrial: boolean
    trialEndsAt?: string | null
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editDialog, setEditDialog] = useState(false)
    const [moduleTypes, setModuleTypes] = useState<{ id: string, name: string }[]>([])
    const [formData, setFormData] = useState({
        name: "",
        role: "USER" as "USER" | "ADMIN" | "SUPERADMIN",
        moduleTypeIds: [] as string[],
        status: "ACTIVE" as "ACTIVE" | "INACTIVE",
        isTrial: false,
        trialEndsAt: "" as string
    })
    const [createDialog, setCreateDialog] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [createFormData, setCreateFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER" as "USER" | "ADMIN" | "SUPERADMIN",
        moduleTypeIds: [] as string[],
        isTrial: false,
        trialEndsAt: "" as string
    })
    const { data: session } = useSession()
    const [reportDialog, setReportDialog] = useState(false)
    const [reportDate, setReportDate] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })

    useEffect(() => {
        fetchUsers()
        axios.get("/api/module-types").then(res => setModuleTypes(res.data)).catch(err => console.error("Failed to fetch module types"))
    }, [])

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/users")
            setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            role: user.role,
            moduleTypeIds: user.moduleTypes?.map(t => t.id) || [],
            status: user.status,
            isTrial: user.isTrial,
            trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt).toISOString().split('T')[0] : ""
        })
        setEditDialog(true)
    }

    const handleUpdate = async () => {
        if (!editingUser) return

        try {
            await axios.put(`/api/users/${editingUser.id}`, formData)
            await fetchUsers()
            setEditDialog(false)
            setEditingUser(null)
        } catch (error) {
            console.error("Failed to update user")
        }
    }

    const handlePromote = async (user: User) => {
        if (!confirm(`Are you sure you want to promote ${user.name} to permanent?`)) return

        try {
            await axios.put(`/api/users/${user.id}`, {
                name: user.name,
                role: user.role,
                moduleTypeIds: user.moduleTypes?.map(t => t.id) || [],
                status: "ACTIVE",
                isTrial: false,
                trialEndsAt: null
            })
            await fetchUsers()
        } catch (error) {
            console.error("Failed to promote user")
        }
    }

    const handleCreate = async () => {
        try {
            await axios.post("/api/register", createFormData)
            await fetchUsers()
            setCreateDialog(false)
            setCreateFormData({
                name: "",
                email: "",
                password: "",
                role: "USER",
                moduleTypeIds: [],
                isTrial: false,
                trialEndsAt: ""
            })
        } catch (error) {
            console.error("Failed to create user")
            alert("Failed to create user")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            await axios.delete(`/api/users/${id}`)
            await fetchUsers()
        } catch (error) {
            console.error("Failed to delete user")
        }
    }

    const handleGenerateReport = async () => {
        try {
            // Dynamically import jsPDF to avoid SSR issues
            const jsPDF = (await import("jspdf")).default
            const autoTable = (await import("jspdf-autotable")).default

            const { data } = await axios.get(`/api/reports/users?month=${reportDate.month}&year=${reportDate.year}`)

            if (!data || data.length === 0) {
                alert("No users found for this period")
                return
            }

            const doc = new jsPDF()

            // --- Stats Calculation ---
            const totalUsers = data.length
            const activeUsers = data.filter((u: any) => u.status === "ACTIVE").length
            const adminCount = data.filter((u: any) => u.role === "ADMIN").length
            const userCount = totalUsers - adminCount

            // Define Month Name
            const monthName = new Date(0, reportDate.month - 1).toLocaleString('default', { month: 'long' })

            // --- Header Design ---
            const pageWidth = doc.internal.pageSize.width

            // Background Header Bar (Primary Color - Dark Blue-ish)
            doc.setFillColor(30, 41, 59) // Slate-900 like
            doc.rect(0, 0, pageWidth, 40, 'F')

            // Site Name (Tenant) - Left
            doc.setFontSize(22)
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.text(siteConfig.name, 14, 20)

            // Report Title - Right
            doc.setFontSize(16)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(200, 200, 200)
            doc.text("User Registration Report", pageWidth - 14, 20, { align: 'right' })

            // Period & Generated Info - Left (Sub header)
            doc.setFontSize(10)
            doc.setTextColor(200, 200, 200)
            doc.text(`Period: ${monthName} ${reportDate.year}`, 14, 30)
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 30, { align: 'right' })

            // --- Executive Summary Section ---
            const summaryStartY = 50
            const boxHeight = 28

            // Draw a light gray box for the summary background with border
            doc.setFillColor(248, 250, 252) // slate-50
            doc.setDrawColor(226, 232, 240) // slate-200
            doc.roundedRect(14, summaryStartY, pageWidth - 28, boxHeight, 3, 3, 'FD')

            // Metric 1: Total Registrations
            doc.setFontSize(8)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(100, 116, 139) // Slate-500
            doc.text("TOTAL NEW USERS", 24, summaryStartY + 10)

            doc.setFontSize(16)
            doc.setTextColor(15, 23, 42) // Slate-900
            doc.text(String(totalUsers), 24, summaryStartY + 20)

            // Divider 1
            doc.setDrawColor(226, 232, 240)
            doc.line(70, summaryStartY + 6, 70, summaryStartY + 22)

            // Metric 2: Active Accounts
            doc.setFontSize(8)
            doc.setTextColor(100, 116, 139)
            doc.text("ACTIVE ACCOUNTS", 80, summaryStartY + 10)

            doc.setFontSize(16)
            doc.setTextColor(15, 23, 42)
            doc.text(String(activeUsers), 80, summaryStartY + 20)

            // Divider 2
            doc.line(130, summaryStartY + 6, 130, summaryStartY + 22)

            // Metric 3: Role Breakdown
            doc.setFontSize(8)
            doc.setTextColor(100, 116, 139)
            doc.text("ROLE DISTRIBUTION", 140, summaryStartY + 10)

            doc.setFontSize(11)
            doc.setTextColor(15, 23, 42)
            doc.text(`Students: ${userCount}`, 140, summaryStartY + 19)
            doc.setTextColor(100, 116, 139) // Muted for second line
            doc.setFontSize(9)
            doc.text(`Admins: ${adminCount}`, 175, summaryStartY + 19) // Inline next to it or below? Let's put it next, bit smaller

            // Table Columns
            const tableColumn = ["Name", "Email", "Role", "Status", "Joined Date", "Modules"]

            // Table Rows
            const tableRows = data.map((u: any) => [
                u.name,
                u.email,
                u.role,
                u.status,
                new Date(u.createdAt).toLocaleDateString(),
                u.moduleTypes?.map((t: any) => t.name).join(", ") || "-"
            ])

            // Generate Table
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: summaryStartY + boxHeight + 10, // Dynamic start relative to summary
                theme: 'grid',
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    lineColor: [220, 220, 220],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [30, 41, 59],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'left'
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 40 }, // Name
                    1: { cellWidth: 50 }, // Email
                    5: { cellWidth: 'auto' } // Modules
                }
            })

            // Save PDF
            doc.save(`users_report_${reportDate.year}_${reportDate.month}.pdf`)
            setReportDialog(false)
        } catch (error) {
            console.error("Failed to generate report", error)
            alert("Failed to generate report")
        }
    }

    if (loading) {
        return <div className="text-muted-foreground">Loading users...</div>
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-end gap-2">
                    {session?.user?.role === "SUPERADMIN" && (
                        <Button onClick={() => setReportDialog(true)} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                            <FileDown className="h-4 w-4" />
                            Generate Report
                        </Button>
                    )}
                    <Button onClick={() => setCreateDialog(true)} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage registered users and their roles</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-secondary/30">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Trial Ends</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-secondary/30 transition-colors">
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="shadow-sm w-fit">
                                                            {user.role}
                                                        </Badge>
                                                        {user.moduleTypes && user.moduleTypes.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {user.moduleTypes.map(t => (
                                                                    <span key={t.id} className="text-[10px] bg-primary/10 text-primary px-1.5 rounded">
                                                                        {t.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.status === "ACTIVE" ? "outline" : "destructive"} className="shadow-sm w-fit">
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.isTrial && user.trialEndsAt ? (
                                                        <span className={new Date(user.trialEndsAt) < new Date() ? "text-destructive font-medium" : ""}>
                                                            {new Date(user.trialEndsAt).toLocaleDateString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {user.isTrial && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handlePromote(user)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            title="Promote to Permanent"
                                                        >
                                                            <span className="font-bold">Promote</span>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                        className="hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id)}
                                                        className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and role</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Module Access (Hold Ctrl to select multiple)</Label>
                            <select
                                multiple
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.moduleTypeIds}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                                    setFormData({ ...formData, moduleTypeIds: selectedOptions })
                                }}
                            >
                                {moduleTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">Select which module types this user can access.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-isTrial"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={formData.isTrial}
                                onChange={(e) => setFormData({ ...formData, isTrial: e.target.checked })}
                            />
                            <Label htmlFor="edit-isTrial">Is Trial User?</Label>
                        </div>
                        {formData.isTrial && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-trialEndsAt">Trial Ends At</Label>
                                <Input
                                    id="edit-trialEndsAt"
                                    type="date"
                                    value={formData.trialEndsAt}
                                    onChange={(e) => setFormData({ ...formData, trialEndsAt: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <select
                                id="edit-status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Add a new user to the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={createFormData.name}
                                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createFormData.email}
                                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="create-password"
                                    type={showPassword ? "text" : "password"}
                                    value={createFormData.password}
                                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Module Access (Hold Ctrl to select multiple)</Label>
                        <select
                            multiple
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            value={createFormData.moduleTypeIds}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                                setCreateFormData({ ...createFormData, moduleTypeIds: selectedOptions })
                            }}
                        >
                            {moduleTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 py-2">
                            <input
                                type="checkbox"
                                id="create-isTrial"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={createFormData.isTrial}
                                onChange={(e) => setCreateFormData({ ...createFormData, isTrial: e.target.checked })}
                            />
                            <Label htmlFor="create-isTrial">Is Trial User?</Label>
                        </div>
                        {createFormData.isTrial && (
                            <div className="space-y-2">
                                <Label htmlFor="create-trialEndsAt">Trial Ends At</Label>
                                <Input
                                    id="create-trialEndsAt"
                                    type="date"
                                    value={createFormData.trialEndsAt}
                                    onChange={(e) => setCreateFormData({ ...createFormData, trialEndsAt: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Report Dialog */}
            <Dialog open={reportDialog} onOpenChange={setReportDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate User Report</DialogTitle>
                        <DialogDescription>Select month and year to generate report for non-trial users.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Month</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={reportDate.month}
                                onChange={(e) => setReportDate({ ...reportDate, month: parseInt(e.target.value) })}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>
                                        {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={reportDate.year}
                                onChange={(e) => setReportDate({ ...reportDate, year: parseInt(e.target.value) })}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReportDialog(false)}>Cancel</Button>
                        <Button onClick={handleGenerateReport}>Download Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
