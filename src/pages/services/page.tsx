import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, GraduationCap, BookOpen, Globe, Code2, Bot, Smartphone, CheckCircle2, ExternalLink, Image, Video, Link2, Tag, Megaphone, Plus, Trash2, Shield } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";
import ParticleBackground from "@/components/particle-background.tsx";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAdmin } from "@/hooks/use-admin.tsx";
import { toast } from "sonner";

const SERVICE_DATA: Record<string, {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features: string[];
  extra?: React.ReactNode;
}> = {
  internship: {
    icon: GraduationCap,
    title: "Internships",
    subtitle: "Build. Learn. Grow.",
    description: "A 1-month immersive internship program designed for students to learn, build, and grow in a real corporate environment.",
    color: "text-yellow-400",
    features: [
      "Work on real-world live projects that make an impact",
      "Teamwork & collaboration with peers",
      "Experience the professional corporate environment",
      "Full mentorship support throughout the program",
      "Duration: 1 Month power-packed program",
      "Verified Internship Experience Certificate upon completion",
      "NOC (No Objection Certificate) provided if required",
      "Registration Fee: ₹500 only",
    ],
    extra: (
      <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/30 text-center">
        <div className="text-2xl font-black text-primary mb-1">Registration Fee</div>
        <div className="text-5xl font-black text-primary">₹500</div>
        <div className="text-muted-foreground mt-2 text-sm">1-Month Internship Program</div>
      </div>
    ),
  },
  training: {
    icon: BookOpen,
    title: "Industrial Training",
    subtitle: "Offering Comprehensive Training & Internships With Projects",
    description: "Professional training with online classes, project-based learning, and certifications that are industry recognized.",
    color: "text-blue-400",
    features: [
      "Online interactive classes with expert instructors",
      "Comprehensive study notes for every course",
      "Project-based learning — build real projects",
      "All-time 1-on-1 mentor support",
      "Internship Experience Certificate upon completion",
      "NOC for colleges and universities",
      "Problem-solving sessions every week",
      "Study notes for every course",
    ],
    extra: (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th className="text-left p-3">SL.</th>
              <th className="text-left p-3">Internship & Training Track</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Web Development (HTML, CSS, JS)", "1 Month", "2k"],
              ["2", "Python", "1 Month", "2.5k"],
              ["3", "Django", "1 Month", "3k"],
              ["4", "Frontend Development (HTML, Bootstrap, JS, Advanced AI use)", "1 Month", "2.5k"],
              ["5", "Advanced AI Use & Backend Development (C/Python) optional", "1 Month", "3k"],
              ["6", "Full Stack Development (Frontend+Backend+Database+AI)", "1 Month", "3.5k"],
            ].map(([sl, track, dur, price]) => (
              <tr key={sl} className="border-t border-border hover:bg-card/60 transition-colors">
                <td className="p-3 text-muted-foreground">{sl}.</td>
                <td className="p-3 font-medium">{track}</td>
                <td className="p-3 text-muted-foreground">{dur}</td>
                <td className="p-3 font-bold text-primary">₹{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  websites: {
    icon: Globe,
    title: "Ready-made Websites",
    subtitle: "Instant Professional Web Presence",
    description: "Pre-built, professionally designed websites ready to deploy. Get your business online instantly with our curated website templates.",
    color: "text-green-400",
    features: [
      "Professionally designed UI/UX",
      "Mobile responsive layouts",
      "SEO optimized structure",
      "Fast deployment & setup",
      "Modern technology stack",
      "Various industry templates available",
      "Post-purchase support included",
      "Customization available on request",
    ],
  },
  "custom-websites": {
    icon: Code2,
    title: "Custom Websites",
    subtitle: "Built Exactly the Way You Want",
    description: "Order-based web development service where we build your website from scratch according to your exact specifications and brand identity.",
    color: "text-purple-400",
    features: [
      "100% custom design tailored to your brand",
      "Full Stack development (Frontend + Backend)",
      "Database integration and management",
      "API integrations as required",
      "Admin dashboard for content management",
      "Responsive across all devices",
      "SEO & performance optimization",
      "Ongoing maintenance & support available",
    ],
  },
  "ai-agents": {
    icon: Bot,
    title: "AI Agents",
    subtitle: "Intelligent Automation for Your Business",
    description: "Build powerful AI agents and automation systems that transform how your business operates. From chatbots to complex workflow automation.",
    color: "text-red-400",
    features: [
      "Custom AI chatbots and virtual assistants",
      "Business process automation agents",
      "Natural Language Processing integration",
      "Integration with existing tools & platforms",
      "GPT-powered intelligent responses",
      "Multi-channel deployment (Web, WhatsApp, etc.)",
      "Analytics and performance monitoring",
      "Scalable and cloud-ready solutions",
    ],
  },
  "mobile-apps": {
    icon: Smartphone,
    title: "Mobile Apps",
    subtitle: "Cross-Platform Mobile Solutions",
    description: "High-quality mobile applications for iOS and Android built with modern cross-platform technology stacks for the best performance.",
    color: "text-pink-400",
    features: [
      "iOS and Android compatible apps",
      "Cross-platform development (React Native / Flutter)",
      "Intuitive and modern UI/UX design",
      "Backend API integration",
      "Push notifications support",
      "Offline functionality when required",
      "App Store & Play Store submission",
      "Post-launch support and updates",
    ],
  },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  announcement: Megaphone,
  offer: Tag,
  discount: Tag,
  poster: Image,
  image: Image,
  video: Video,
  link: Link2,
};

export default function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = id ?? "";
  const svc = SERVICE_DATA[serviceId];
  const { session } = useAdmin();

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ type: "announcement", title: "", body: "", url: "" });
  const [saving, setSaving] = useState(false);

  const contentItems = useQuery(api.content.listByService, { serviceId });
  const addContent = useMutation(api.content.addContentNoAuth);
  const deleteContent = useMutation(api.content.deleteContentNoAuth);

  const CONTENT_TYPES = [
    { value: "announcement", label: "Announcement" },
    { value: "offer", label: "Offer" },
    { value: "discount", label: "Discount" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "link", label: "Link" },
    { value: "poster", label: "Poster" },
  ];

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await addContent({
        serviceId,
        type: form.type,
        title: form.title,
        body: form.body || undefined,
        url: form.url || undefined,
        adminName: session?.name ?? "Admin",
      });
      toast.success("Content added!");
      setForm({ type: "announcement", title: "", body: "", url: "" });
      setAdding(false);
    } catch {
      toast.error("Failed to add content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: Id<"content">) => {
    try {
      await deleteContent({ id: itemId, adminName: session?.name ?? "Admin" });
      toast.success("Removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!svc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const Icon = svc.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Button
            variant="ghost"
            className="mb-6 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className={`inline-flex p-4 rounded-2xl bg-card border border-border mb-6 ${svc.color}`}>
              <Icon className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-black mb-3">{svc.title}</h1>
            <p className={`text-xl font-semibold mb-4 ${svc.color}`}>{svc.subtitle}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{svc.description}</p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {svc.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Extra content */}
          {svc.extra && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              {svc.extra}
            </motion.div>
          )}

          {/* Admin-added content */}
          {contentItems && contentItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold mb-6">Latest Updates &amp; Offers</h2>
              <div className="space-y-4">
                {contentItems.map((item: Doc<"content">) => {
                  const TypeIcon = TYPE_ICONS[item.type] ?? Megaphone;
                  return (
                    <Card key={item._id} className="border border-primary/20 bg-card">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <TypeIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold">{item.title}</span>
                              <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                            </div>
                            {item.body && <p className="text-sm text-muted-foreground mb-3">{item.body}</p>}
                            {item.url && (
                              <div>
                                {(item.type === "image" || item.type === "poster") ? (
                                  <img src={item.url} alt={item.title} className="rounded-xl max-h-64 object-cover" />
                                ) : item.type === "video" ? (
                                  <video src={item.url} controls className="rounded-xl max-h-64 w-full" />
                                ) : (
                                  <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary text-sm hover:underline">
                                    <ExternalLink className="h-3.5 w-3.5" /> {item.url}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                          {/* Admin delete button */}
                          {session && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="shrink-0 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Inline Admin Edit Panel */}
          {session && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-5 rounded-2xl border-2 border-primary/40 bg-card/90 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary">Admin Controls</span>
                <Badge variant="secondary" className="text-xs ml-auto">{session.name}</Badge>
              </div>

              {adding ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1 block">Content Type</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {CONTENT_TYPES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setForm({ ...form, type: t.value })}
                          className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            form.type === t.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary/50 border-border hover:border-primary/50"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Title *</Label>
                    <Input placeholder="Enter a title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Description (optional)</Label>
                    <Input placeholder="Details, offer text, etc." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">
                      {form.type === "image" || form.type === "poster" ? "Image URL" : form.type === "video" ? "Video URL" : "URL / Link (optional)"}
                    </Label>
                    <Input
                      placeholder="https://..."
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                    />
                    {(form.type === "image" || form.type === "poster") && (
                      <p className="text-xs text-muted-foreground mt-1">Paste a direct image URL from any source</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleAdd} disabled={saving} className="cursor-pointer">
                      {saving ? "Saving..." : "Save Content"}
                    </Button>
                    <Button variant="ghost" onClick={() => { setAdding(false); setForm({ type: "announcement", title: "", body: "", url: "" }); }} className="cursor-pointer">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setAdding(true)} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" /> Add Content to This Section
                </Button>
              )}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center"
          >
            <h3 className="text-2xl font-black mb-3">Interested? Get in Touch!</h3>
            <p className="text-muted-foreground mb-6">Contact us today and take the first step toward your future.</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <a href="tel:6909993204" className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                📞 6909993204
              </a>
              <a href="tel:8906554583" className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                📞 8906554583
              </a>
              <a href="mailto:knenterprise.official@gmail.com" className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                ✉️ knenterprise.official@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
