import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  GraduationCap, BookOpen, Globe, Code2, Bot, Smartphone,
  MapPin, Phone, Mail, ChevronRight, Award, Building2, Star } from
"lucide-react";
import ParticleBackground from "@/components/particle-background.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

const SERVICES = [
{
  id: "internship",
  icon: GraduationCap,
  title: "Internships",
  desc: "1-month immersive programs with real-world projects, mentorship, and verified experience certificates.",
  color: "from-yellow-500/20 to-yellow-600/5",
  accent: "text-yellow-400",
  badge: "₹500 Registration"
},
{
  id: "training",
  icon: BookOpen,
  title: "Industrial Training",
  desc: "Online classes, study notes, project-based learning, and certificates recognized by industry.",
  color: "from-blue-500/20 to-blue-600/5",
  accent: "text-blue-400",
  badge: "From ₹2,000"
},
{
  id: "websites",
  icon: Globe,
  title: "Ready-made Websites",
  desc: "Pre-built, professionally designed websites ready to deploy for your business needs.",
  color: "from-green-500/20 to-green-600/5",
  accent: "text-green-400",
  badge: "Instant Deploy"
},
{
  id: "custom-websites",
  icon: Code2,
  title: "Custom Websites",
  desc: "Order-based web development tailored to your exact requirements and brand identity.",
  color: "from-purple-500/20 to-purple-600/5",
  accent: "text-purple-400",
  badge: "Made to Order"
},
{
  id: "ai-agents",
  icon: Bot,
  title: "AI Agents",
  desc: "Build intelligent AI agents and automation systems to power your business workflows.",
  color: "from-red-500/20 to-red-600/5",
  accent: "text-red-400",
  badge: "Cutting Edge"
},
{
  id: "mobile-apps",
  icon: Smartphone,
  title: "Mobile Apps",
  desc: "Cross-platform mobile applications built with modern tech stacks for iOS and Android.",
  color: "from-pink-500/20 to-pink-600/5",
  accent: "text-pink-400",
  badge: "iOS & Android"
}];


const CREDENTIALS = [
{ label: "Government of India Registered Startup", icon: Building2 },
{ label: "Recognized under Startup India", icon: Star },
{ label: "Registered under MSME, Ministry of GoI", icon: Award }];


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-10">
          
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-150 animate-pulse" />
            <img
              src="/web-logo.png"
              alt="K&N Enterprises"
              className="relative h-36 w-36 object-cover scale-[0.82] [clip-path:circle(50%)] my-2.5" />
            
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-2">
            
            <span className="text-primary">K&N</span>{" "}
            <span className="text-foreground">Enterprises</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground tracking-[0.3em] text-sm md:text-base mb-6">
            
            RESEARCH &bull; INNOVATION &bull; TECHNOLOGY
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl">
            
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
              {"\"From Learning to Real Industry Projects — We Build Future Developers\""}
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {CREDENTIALS.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="flex items-center gap-2 bg-card/80 border border-primary/30 rounded-full px-4 py-2 text-xs font-medium text-primary">
                    <Icon className="h-3.5 w-3.5" />
                    {c.label}
                  </div>
                );
              })}
            </div>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground font-bold px-8 py-4 text-base rounded-full shadow-lg hover:shadow-primary/40 transition-all hover:scale-105 cursor-pointer"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
              
              Explore Our Services <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14">
            
            <h2 className="text-4xl font-black mb-3">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to learn, grow, and build your digital future
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {SERVICES.map((svc) => {
              const SvcIcon = svc.icon;
              return (
            <motion.div key={svc.id} variants={item}>
                <Card
                onClick={() => navigate(`/services/${svc.id}`)}
                className={`cursor-pointer group relative overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl bg-gradient-to-br ${svc.color}`}>
                
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-card/50 ${svc.accent}`}>
                        <SvcIcon className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                        {svc.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Learn more <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About / Owners */}
      <section id="about" className="relative z-10 px-4 py-20 bg-card/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            
            <h2 className="text-4xl font-black mb-4">
              About <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
              K&N Enterprises is a Government of India Registered Startup focused on bridging the gap
              between education and industry. We empower students and businesses with cutting-edge
              technology services.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              {[
              { name: "Subhajit Dhar", role: "Co-Founder & CEO" },
              { name: "Aditya Saha", role: "Co-Founder & COO" }].
              map((owner) =>
              <div
                key={owner.name}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-primary/20">
                
                  <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-2xl font-black text-primary">
                    {owner.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{owner.name}</div>
                    <div className="text-sm text-muted-foreground">{owner.role}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Credentials */}
            <div className="flex flex-wrap justify-center gap-4">
              {CREDENTIALS.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/30 bg-card/60 text-sm font-medium">
                    <Icon className="h-4 w-4 text-primary" />
                    {c.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative z-10 px-4 py-20 bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            
            <h2 className="text-4xl font-black mb-4">
              Contact <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground mb-10">
              Ready to start your journey? Get in touch with us today!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
              { icon: MapPin, label: "Location", value: "Barasat, West Bengal, 700125" },
              { icon: Phone, label: "Phone", value: "6909993204 & 8906554583" },
              { icon: Mail, label: "Email", value: "knenterprise.official@gmail.com" }].
              map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="p-5 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-sm text-muted-foreground text-center">{c.value}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>);

}