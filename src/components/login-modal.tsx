"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

interface LoginModalProps {
    children?: React.ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    callbackUrl?: string
}

export function LoginModal({ children, defaultOpen = false, open: controlledOpen, onOpenChange: controlledOnOpenChange, callbackUrl }: LoginModalProps) {
    const router = useRouter()
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        controlledOnOpenChange?.(newOpen)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError(null)
            const res = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (res?.error) {
                setError("Invalid email or password")
            } else {
                setOpen(false)
                router.push(callbackUrl || "/dashboard")
                router.refresh()
            }
        } catch (error) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px] border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300">
                <DialogHeader className="space-y-3 pb-4 border-b border-border/40">
                    <DialogTitle className="text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent text-center">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Enter your credentials to access your dashboard
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                            <Input
                                                placeholder="m@example.com"
                                                className="pl-9 bg-muted/50 border-input/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                className="pl-9 bg-muted/50 border-input/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center animate-in fade-in-0 zoom-in-95">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
