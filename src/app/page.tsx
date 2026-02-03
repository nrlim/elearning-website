import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site-config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, BookOpen, Users, Award, TrendingUp, Shield, Zap, Check, Star } from "lucide-react";
import { LoginModal } from "@/components/login-modal";

import { ScrollToTop } from "@/components/scroll-to-top";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <ScrollToTop />

      <main className="flex-1">
        {/* Hero Section - Split Layout */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-20">
          <div className="container mx-auto px-4 md:px-6 z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Left: Content */}
              <div className="flex flex-col items-start text-left space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                  Access Top <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Crypto Academies
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  The ultimate mirroring platform. Get premium access to
                  <span className="font-semibold text-foreground"> Akademi Crypto</span>,
                  <span className="font-semibold text-foreground"> Trade With Suli</span>,
                  <span className="font-semibold text-foreground"> KJo Academy</span>, and more.
                  All in one subscription.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                  <LoginModal>
                    <Button size="lg" className="h-14 px-8 text-lg rounded-xl gap-2 shadow-xl shadow-primary/20">
                      Get All-Access
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </LoginModal>
                  <Link href="#courses">
                    <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-xl gap-2">
                      View Catalog
                    </Button>
                  </Link>
                </div>

                <div className="pt-8 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">1,000+ Students</span>
                    <span className="text-xs">Joined this month</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/40 w-full">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Premium Content From
                  </p>
                  <div className="flex flex-wrap gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                    {/* Partner Logos (Text representation for now, or use images if available) */}
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">AC</span>
                      Akademi Crypto
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white">TS</span>
                      SULI
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white">KJ</span>
                      KJo Academy
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: 3D Visual */}
              <div className="relative hidden lg:block perspective-[2000px] group">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50" />

                {/* Tilted Card */}
                <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl p-6 transition-all duration-700 transform rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-[0deg] group-hover:rotate-x-[0deg]">
                  {/* Fake Dashboard UI */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Zap className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold">{siteConfig.name} Pro</p>
                        <p className="text-xs text-muted-foreground">Premium Plan</p>
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                      <p className="text-muted-foreground text-xs">Total Progress</p>
                      <p className="text-2xl font-bold">84%</p>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[84%] bg-primary" />
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                      <p className="text-muted-foreground text-xs">Certificates</p>
                      <p className="text-2xl font-bold">4</p>
                      <div className="flex gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                        <div className="h-10 w-16 bg-muted rounded-md relative overflow-hidden">
                          <div className="absolute inset-0 bg-primary/10" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Advanced Trading Patterns</p>
                          <p className="text-xs text-muted-foreground">Module {i} • 45 mins</p>
                        </div>
                        <PlayCircle className="h-8 w-8 text-primary opacity-50" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Sticky Layout */}
        <section id="features" className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-12 gap-12">

              {/* Sticky Heading */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-6">
                <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
                  <Shield className="h-4 w-4" />
                  Why Choose Us
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Reinventing how you <span className="text-primary">learn.</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  {siteConfig.description}. We provide the tools you need to succeed.
                </p>
                <LoginModal>
                  <Button className="gap-2 rounded-full">
                    View All Features <ArrowRight className="h-4 w-4" />
                  </Button>
                </LoginModal>
              </div>

              {/* Scrolling Cards */}
              <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: BookOpen,
                    title: "Structured Learning",
                    desc: "Curated paths from basics to advanced topics."
                  },
                  {
                    icon: PlayCircle,
                    title: "High-Quality Video",
                    desc: "4K video content with professional audio."
                  },
                  {
                    icon: Users,
                    title: "Community First",
                    desc: "Join thousands of learners in our Discord."
                  },
                  {
                    icon: Zap,
                    title: "Realtime Token Calls",
                    desc: "Get instant alerts and trading signals for breakout tokens."
                  },
                  {
                    icon: TrendingUp,
                    title: "Market Analysis",
                    desc: "Learn to analyze trends and market data."
                  },
                  {
                    icon: Shield,
                    title: "Secure Platform",
                    desc: "Your progress and data are always unified."
                  }
                ].map((feature, i) => (
                  <div key={i} className="group p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                    <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Featured Courses - Minimal List */}
        <section id="courses" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold">Featured Courses</h2>
                <p className="text-muted-foreground">Explore our most popular learning paths</p>
              </div>
              <Link href="/dashboard" className="hidden md:block">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Akademi Crypto",
                  level: "Comprehensive",
                  students: "50k+",
                  duration: "Mastery Path",
                  image: "https://unavatar.io/google/akademicrypto.com",
                  description: "Belajar crypto dari dasar hingga mahir. The ultimate comprehensive guide to cryptocurrency.",
                  features: ["Crypto Basics", "Advanced DeFi", "Research Framework"]
                },
                {
                  title: "Trade With Suli",
                  level: "Technical Analysis",
                  students: "10k+",
                  duration: "Signal & Analysis",
                  image: "https://unavatar.io/twitter/tradewithsuli",
                  description: "Analisa teknikal dan fundamental mendalam. Learn to trade like a pro with deep market insights.",
                  features: ["Daily Signals", "Market Outlook", "Live TradingSession"]
                },
                {
                  title: "KJo Academy",
                  level: "Portfolio Mgmt",
                  students: "15k+",
                  duration: "Strategy",
                  image: "https://unavatar.io/kjoacademy.com",
                  description: "Strategi trading dan manajemen portofolio. Master the art of portfolio growth and risk management.",
                  features: ["Portfolio Strategy", "Risk Management", "Altcoin Gems"]
                }
              ].map((course, i) => (
                <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-muted">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span className="bg-background/20 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-xs text-white/50 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.students}</span>
                      <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" /> {course.duration}</span>
                    </div>

                    <LoginModal>
                      <Button className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Learning
                      </Button>
                    </LoginModal>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{siteConfig.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering the next generation of developers and crypto enthusiasts through world-class education.
              </p>
            </div>
            {[
              {
                header: "Platform",
                links: ["Courses", "Mentorship", "For Teams"]
              },
              {
                header: "Resources",
                links: ["Blog", "Community", "Help Center", "Careers"]
              },
              {
                header: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"]
              }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.header}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name} Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Social icons would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
