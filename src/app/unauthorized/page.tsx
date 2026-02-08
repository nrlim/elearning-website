import Link from "next/link"
import { ShieldAlert, ArrowLeft, ShoppingCart } from "lucide-react"
import { siteConfig } from "@/config/site-config"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden relative selection:bg-primary/20 selection:text-primary">
            {/* Ambient Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Glass Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl">

                    {/* Top Glow Line */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

                    <div className="p-8 flex flex-col items-center text-center">

                        {/* Status Icon */}
                        <div className="mb-6 relative group">
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                <ShieldAlert className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
                            Akses <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Dibatasi</span>
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                            Akun Discord terhubung, namun Anda belum memiliki <span className="text-white font-medium">Role Premium</span> untuk mengakses materi eksklusif ini.
                        </p>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                        {/* Action List */}
                        <div className="w-full space-y-4 text-left mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Solusi Akses</span>
                            </div>

                            <ul className="grid gap-3">
                                {[
                                    "Gabung server Discord resmi kami",
                                    "Hubungi admin untuk verifikasi role",
                                    "Login kembali setelah update role"
                                ].map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-400 group">
                                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                            <span className="text-xs">{idx + 1}</span>
                                        </div>
                                        <span className="group-hover:text-slate-300 transition-colors">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="w-full grid gap-3">
                            {/* Premium CTA */}
                            {siteConfig.fallbackAccessLink && (
                                <div className="space-y-3 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px bg-white/5 flex-1" />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Rekomendasi</span>
                                        <div className="h-px bg-white/5 flex-1" />
                                    </div>
                                    <a
                                        href={siteConfig.fallbackAccessLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-orange-900/20 border border-white/10 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                        <ShoppingCart className="w-4 h-4" />
                                        <span className="relative">Beli Akses Premium</span>
                                    </a>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/?login=true"
                                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-95"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm">Kembali</span>
                                </Link>

                                {siteConfig.discordLink && (
                                    <a
                                        href={siteConfig.discordLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white font-medium py-3 px-4 rounded-xl transition-all border border-[#5865F2]/20 hover:border-[#5865F2] active:scale-95 group"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-4 h-4 fill-current transition-colors"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.0766.1363-.1625.321-.2235.4661a18.2736 18.2736 0 00-5.445 0c-.061-.1451-.1469-.3298-.2235-.4661a19.7432 19.7432 0 00-4.8851 1.5152c-3.111 4.6467-3.968 9.1724-3.548 13.6231a20.026 20.026 0 006.0123 3.0336c.4566-.6225.8601-1.2952 1.2014-2.007a13.3444 13.3444 0 01-1.9213-.913c.1625-.119.3193-.242.4704-.3696 3.705 1.71 7.7416 1.71 11.411 0 .1511.1276.3079.2506.4704.3696a13.1906 13.1906 0 01-1.9213.913c.3413.7118.7448 1.3845 1.2014 2.007a20.0347 20.0347 0 006.0123-3.0336c.4912-5.1818-.8486-9.664-3.548-13.6231zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0951 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z" />
                                        </svg>
                                        <span className="text-sm">Join Community</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-500 text-xs text-balance">
                    Mengalami kendala teknis? <a href="#" className="underline hover:text-indigo-400 transition-colors">Hubungi Support</a>
                </p>
            </div>
        </div>
    )
}
