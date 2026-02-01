import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, Users, Award, TrendingUp, Shield, Zap, Check, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Enhanced animated background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />

          {/* Floating orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[90px] -z-10 animate-pulse" style={{ animationDelay: '4s' }} />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-5xl text-center space-y-10">
              {/* Enhanced Badge */}
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-1000 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/5 backdrop-blur-xl px-5 py-2 text-sm shadow-lg shadow-primary/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-sm shadow-primary"></span>
                </span>
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-semibold">
                  Join 10,000+ Students Learning Today
                </span>
              </div>

              {/* Enhanced Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 leading-[1.1]">
                  Become a
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></span>
                    <span className="relative bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-300%">
                      Crypto Expert
                    </span>
                  </span>
                </h1>

                {/* Enhanced Subtitle */}
                <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200 font-light">
                  Master blockchain, cryptocurrency, and Web3 through expert-led video courses.
                  <span className="text-foreground font-medium"> Start learning for free today.</span>
                </p>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                <Link href="/login" className="group">
                  <Button size="lg" className="relative h-16 px-10 text-lg font-semibold rounded-2xl gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient"></span>
                    <span className="relative flex items-center gap-3 text-white">
                      Login to Start Learning
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link href="#courses" className="group">
                  <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-semibold rounded-2xl border-2 border-border/60 hover:border-primary/60 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Enhanced Stats with icons */}
              <div className="grid grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
                {[
                  { value: "10K+", label: "Active Students", icon: Users },
                  { value: "50+", label: "Video Courses", icon: PlayCircle },
                  { value: "4.9★", label: "Avg Rating", icon: Star }
                ].map((stat, i) => (
                  <div key={i} className="group text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:bg-card/50 transition-all duration-300">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section id="features" className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                WHY CRYPTOLEARN
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Everything You Need to
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Master Blockchain
                </span>
              </h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
                Join the most comprehensive crypto education platform designed for beginners to experts
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: "Industry Expert Content",
                  description: "Learn from blockchain veterans with 10+ years of experience in crypto markets",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: PlayCircle,
                  title: "HD Video Tutorials",
                  description: "Crystal-clear 4K videos with step-by-step breakdowns of complex blockchain concepts",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: Users,
                  title: "Thriving Community",
                  description: "Connect with 10,000+ crypto enthusiasts, share insights, and grow together",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Award,
                  title: "Verified Certificates",
                  description: "Earn industry-recognized certificates to showcase on LinkedIn and your resume",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: TrendingUp,
                  title: "Always Up-to-Date",
                  description: "Weekly content updates covering the latest DeFi protocols and market trends",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level encryption protects your data and learning progress 24/7",
                  color: "from-indigo-500 to-purple-500"
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-3xl bg-card/50 border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 backdrop-blur-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} p-[2px] mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <div className="h-full w-full rounded-2xl bg-background flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Preview Section - Enhanced */}
        <section id="courses" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                FEATURED COURSES
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Start Learning <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Today</span>
              </h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
                Choose from our most popular courses and begin your crypto journey
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {[
                {
                  title: "Blockchain Fundamentals",
                  description: "Master the core concepts powering the crypto revolution",
                  level: "Beginner",
                  duration: "8 hours",
                  students: "5.2K",
                  gradient: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  title: "Smart Contract Development",
                  description: "Build and deploy Solidity smart contracts on Ethereum",
                  level: "Intermediate",
                  duration: "12 hours",
                  students: "3.8K",
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
                {
                  title: "Advanced DeFi Strategies",
                  description: "Master yield farming, liquidity pools, and protocol analysis",
                  level: "Advanced",
                  duration: "16 hours",
                  students: "2.1K",
                  gradient: "from-orange-500/20 to-red-500/20"
                }
              ].map((course, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                >
                  {/* Course Thumbnail */}
                  <div className={`aspect-video bg-gradient-to-br ${course.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <PlayCircle className="relative h-20 w-20 text-white drop-shadow-2xl group-hover:scale-125 transition-transform duration-300" />
                      </div>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                      {course.level}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                    </div>

                    {/* Course Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href="/login">
                      <Button className="w-full rounded-xl gap-2 group-hover:gap-3 transition-all">
                        Login to Enroll
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl text-lg border-2 hover:border-primary/60 hover:bg-primary/5">
                  View All 50+ Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-10 p-12 rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-xl shadow-2xl shadow-primary/10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black leading-tight">
                  Ready to Start Your
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Crypto Journey?
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join <span className="text-foreground font-bold">10,000+</span> students already mastering blockchain technology
                </p>
              </div>

              {/* Benefits List */}
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  "Free to start",
                  "Cancel anytime",
                  "Expert support"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/login" className="inline-block">
                <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-2xl gap-3 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                  <Zap className="h-6 w-6" />
                  Login to Start
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                CryptoLearn
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering the next generation of blockchain developers and crypto investors.
              </p>
              <div className="flex gap-2">
                {["Twitter", "Discord", "Telegram"].map((social) => (
                  <Button key={social} variant="outline" size="sm" className="rounded-lg">
                    {social[0]}
                  </Button>
                ))}
              </div>
            </div>
            {[
              {
                title: "Learn",
                links: ["All Courses", "Free Tutorials", "Certifications", "Learning Paths"]
              },
              {
                title: "Company",
                links: ["About Us", "Blog", "Careers", "Press Kit"]
              },
              {
                title: "Support",
                links: ["Help Center", "Community", "Contact Us", "FAQs"]
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4 text-foreground">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
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

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 CryptoLearn. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
