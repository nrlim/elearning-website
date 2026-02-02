import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, BookOpen, Users, Award, TrendingUp, Shield, Zap, Check, Star } from "lucide-react";
import { LoginModal } from "@/components/login-modal";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              {/* Badge */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm shadow-sm hover:bg-primary/10 transition-colors cursor-default">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-foreground/80">
                    Trusted by <span className="text-primary font-semibold">10,000+</span> Students
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Master the Future of <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent pb-2">
                  Web3 & Crypto
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                Expert-led courses to help you master blockchain technology.
                Start your journey from beginner to expert today.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <LoginModal>
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl gap-2 font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </LoginModal>
                <Link href="#courses" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl gap-2 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all hover:scale-[1.02]">
                    <PlayCircle className="h-5 w-5" />
                    View Courses
                  </Button>
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-16 border-t border-border/40 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 w-full max-w-3xl">
                {[
                  { label: "Active Students", value: "10K+" },
                  { label: "Video Lessons", value: "500+" },
                  { label: "Average Rating", value: "4.9/5" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center space-y-1">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 md:py-32 bg-muted/30 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-xl space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Why learn with <span className="text-primary">CryptoLearn</span>?
                </h2>
                <p className="text-muted-foreground text-lg">
                  We provide the most comprehensive curriculum designed for the modern web.
                </p>
              </div>
              <Button variant="ghost" className="hidden md:inline-flex gap-2">
                See all features <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  icon: Award,
                  title: "Certificates",
                  desc: "Earn verified certificates upon completion."
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
                <div key={i} className="group p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative rounded-3xl overflow-hidden mb-16 border border-border/50 shadow-2xl shadow-primary/5 bg-background/60 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/5" />

              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left z-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Trending Now
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Popular Courses
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Explore our highest-rated courses and start learning today.
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <LoginModal>
                    <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl gap-2 border-primary/20 bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                      View All Courses <ArrowRight className="h-4 w-4" />
                    </Button>
                  </LoginModal>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Blockchain Basics",
                  level: "Beginner",
                  students: "5.2k",
                  duration: "4h 30m",
                  image: "/assets/course-blockchain-v2.png"
                },
                {
                  title: "Smart Contracts",
                  level: "Intermediate",
                  students: "3.2k",
                  duration: "8h 15m",
                  image: "/assets/course-smart-contracts-v2.png"
                },
                {
                  title: "DeFi Masterclass",
                  level: "Advanced",
                  students: "2.1k",
                  duration: "12h 00m",
                  image: "/assets/course-defi-v4.png"
                }
              ].map((course, i) => (
                <div key={i} className="group rounded-3xl border border-border/50 bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        <PlayCircle className="h-8 w-8 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        4.9
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-6">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {course.students}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PlayCircle className="h-4 w-4" />
                        {course.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <LoginModal>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View All Courses
                </Button>
              </LoginModal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />

          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Ready to start your journey?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students and start learning blockchain technology today. Free to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <LoginModal>
                  <Button size="lg" className="h-14 px-8 text-lg rounded-2xl w-full sm:w-auto">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </LoginModal>
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                No credit card required for free courses.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">CryptoLearn</h3>
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
              © {new Date().getFullYear()} CryptoLearn Inc. All rights reserved.
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
