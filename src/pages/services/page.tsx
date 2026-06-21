import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, GraduationCap, BookOpen, Globe, Code2, Bot, Smartphone, CheckCircle2, ExternalLink, Image, Video, Link2, Tag, Megaphone, Plus, Trash2, Shield, Upload, X, File, Film, Bell, Gift, Percent } from "lucide-react";
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
      "Seats: Limited seats available for the current batch",
    ],
    extra: (
      <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/30 text-center">
        <div className="text-2xl font-black text-primary mb-1">Program Status</div>
        <div className="text-4xl font-black text-primary">Enrollment Open</div>
        <div className="text-muted-foreground mt-2 text-sm">Limited seats available for the current batch. Apply today!</div>
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
              <th className="text-left p-3">Focus Outcome</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Web Development (HTML, CSS, JS)", "1 Month", "Responsive UI Project & Live Hosting"],
              ["2", "Python", "1 Month", "Core Concepts, OOP & Automation Scripting"],
              ["3", "Django", "1 Month", "REST APIs, Databases & Admin Dashboard"],
              ["4", "Frontend Development (HTML, Bootstrap, JS, Advanced AI use)", "1 Month", "Modern Responsive Sites & AI Tool Assisted Coding"],
              ["5", "Advanced AI Use & Backend Development (C/Python) optional", "1 Month", "AI Pipelines, Algorithms & Backend Integration"],
              ["6", "Full Stack Development (Frontend+Backend+Database+AI)", "1 Month", "End-to-End SaaS App, Database & AI Agent Setup"],
            ].map(([sl, track, dur, outcome]) => (
              <tr key={sl} className="border-t border-border hover:bg-card/60 transition-colors">
                <td className="p-3 text-muted-foreground">{sl}.</td>
                <td className="p-3 font-medium">{track}</td>
                <td className="p-3 text-muted-foreground">{dur}</td>
                <td className="p-3 font-bold text-primary">{outcome}</td>
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

export function UpdateCard({ item, onDelete, showDelete }: {
  item: Doc<"content">;
  onDelete: (id: Id<"content">) => void;
  showDelete: boolean;
}) {
  if (item.type === "announcement") {
    return (
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(6,182,212,0.15)" }}
        className="relative overflow-hidden p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-blue-950/10 to-slate-900/40 backdrop-blur-sm"
      >
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="relative p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-xl bg-cyan-400/20"
            />
            <motion.div
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <Bell className="h-5 w-5" />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-extrabold text-lg text-cyan-300">{item.title}</h3>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] uppercase font-bold tracking-wider shrink-0">
                Announcement
              </Badge>
            </div>
            {item.body && <p className="text-sm text-slate-350 leading-relaxed mb-3">{item.body}</p>}
            
            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 px-3.5 py-1.5 rounded-full transition-all"
                  >
                    <ExternalLink className="h-3 w-3" /> Visit Link
                  </a>
                ))}
              </div>
            )}
          </div>
          {showDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="shrink-0 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (item.type === "offer") {
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(16,185,129,0.15)" }}
        className="relative overflow-hidden p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-teal-950/10 to-slate-900/40 backdrop-blur-sm"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="relative p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <Gift className="h-5 w-5" />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-extrabold text-lg text-emerald-300">{item.title}</h3>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider shrink-0">
                Special Offer
              </Badge>
            </div>
            {item.body && <p className="text-sm text-slate-350 leading-relaxed mb-3">{item.body}</p>}
            
            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-400 text-emerald-400 px-3.5 py-1.5 rounded-full transition-all"
                  >
                    <ExternalLink className="h-3 w-3" /> Grab Offer
                  </a>
                ))}
              </div>
            )}
          </div>
          {showDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="shrink-0 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (item.type === "discount") {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(245,158,11,0.2)" }}
        className="relative overflow-hidden p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-orange-950/10 to-slate-900/40 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="relative p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <motion.div
              animate={{ rotate: [-12, 12, -12] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Percent className="h-5 w-5" />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-extrabold text-lg text-amber-300">{item.title}</h3>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold tracking-wider shrink-0">
                Discount
              </Badge>
            </div>
            {item.body && <p className="text-sm text-slate-350 leading-relaxed mb-3">{item.body}</p>}
            
            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400 text-amber-400 px-3.5 py-1.5 rounded-full transition-all"
                  >
                    <ExternalLink className="h-3 w-3" /> Claim Discount
                  </a>
                ))}
              </div>
            )}
          </div>
          {showDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="shrink-0 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Post Card
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(168,85,247,0.15)" }}
      className="relative overflow-hidden p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/10 via-slate-900/30 to-indigo-950/15 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div className="relative p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
          <Image className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-extrabold text-lg text-purple-300">{item.title}</h3>
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] uppercase font-bold tracking-wider shrink-0">
              Post
            </Badge>
          </div>
          {item.body && <p className="text-sm text-slate-350 leading-relaxed mb-3">{item.body}</p>}
          
          {/* Multiple Images */}
          {item.images && item.images.length > 0 && (
            <div className={`grid gap-2.5 mt-3 ${item.images.length === 1 ? "grid-cols-1" : item.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {item.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-black cursor-zoom-in"
                  onClick={() => window.open(img, "_blank")}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Multiple Videos */}
          {item.videos && item.videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {item.videos.map((vid, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-border/40 bg-black">
                  <video src={vid} controls className="w-full max-h-64 object-contain" />
                </div>
              ))}
            </div>
          )}

          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-400 text-purple-400 px-3.5 py-1.5 rounded-full transition-all"
                >
                  <ExternalLink className="h-3 w-3" /> View Link
                </a>
              ))}
            </div>
          )}
        </div>
        {showDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="shrink-0 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = id ?? "";
  const svc = SERVICE_DATA[serviceId];
  const { session } = useAdmin();

  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ type: "announcement", title: "", body: "" });
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [pastedVideos, setPastedVideos] = useState<string[]>([]);
  const [newVideo, setNewVideo] = useState("");
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  const contentItems = useQuery(api.content.listByService, { serviceId });
  const addContent = useMutation(api.content.addContentNoAuth);
  const deleteContent = useMutation(api.content.deleteContentNoAuth);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);

  const CONTENT_TYPES = [
    { value: "announcement", label: "Announcement" },
    { value: "offer", label: "Offer" },
    { value: "discount", label: "Discount" },
    { value: "post", label: "Post" },
  ];

  const handleAddLink = () => {
    if (newLink.trim()) {
      let formatted = newLink.trim();
      if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
        formatted = "https://" + formatted;
      }
      setLinks([...links, formatted]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAddPastedImage = () => {
    if (newImage.trim()) {
      setPastedImages([...pastedImages, newImage.trim()]);
      setNewImage("");
    }
  };

  const handleRemovePastedImage = (index: number) => {
    setPastedImages(pastedImages.filter((_, i) => i !== index));
  };

  const handleAddImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImageFile = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleAddPastedVideo = () => {
    if (newVideo.trim()) {
      setPastedVideos([...pastedVideos, newVideo.trim()]);
      setNewVideo("");
    }
  };

  const handleRemovePastedVideo = (index: number) => {
    setPastedVideos(pastedVideos.filter((_, i) => i !== index));
  };

  const handleAddVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFiles([...videoFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveVideoFile = (index: number) => {
    setVideoFiles(videoFiles.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      // 1. Upload files
      const imageStorageIds: string[] = [];
      for (const file of imageFiles) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Failed to upload image file");
        const { storageId } = await res.json();
        imageStorageIds.push(storageId);
      }

      const videoStorageIds: string[] = [];
      for (const file of videoFiles) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Failed to upload video file");
        const { storageId } = await res.json();
        videoStorageIds.push(storageId);
      }

      // 2. Save content
      await addContent({
        serviceId,
        type: form.type,
        title: form.title,
        body: form.body || undefined,
        links: links.length > 0 ? links : undefined,
        images: pastedImages.length > 0 ? pastedImages : undefined,
        videos: pastedVideos.length > 0 ? pastedVideos : undefined,
        imageStorageIds: imageStorageIds.length > 0 ? imageStorageIds : undefined,
        videoStorageIds: videoStorageIds.length > 0 ? videoStorageIds : undefined,
        adminName: session?.name ?? "Admin",
      });

      toast.success("Content added successfully!");
      // Reset
      setForm({ type: "announcement", title: "", body: "" });
      setLinks([]);
      setNewLink("");
      setPastedImages([]);
      setNewImage("");
      setImageFiles([]);
      setPastedVideos([]);
      setNewVideo("");
      setVideoFiles([]);
      setAdding(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add content");
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
                {contentItems.map((item: Doc<"content">) => (
                  <UpdateCard
                    key={item._id}
                    item={item}
                    onDelete={handleDelete}
                    showDelete={!!session}
                  />
                ))}
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
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs mb-1 block">Content Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

                  {/* Multiple Links Option */}
                  <div className="space-y-2">
                    <Label className="text-xs block">Links (Add multiple links)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLink())}
                      />
                      <Button type="button" onClick={handleAddLink} size="sm" variant="secondary" className="cursor-pointer">
                        Add
                      </Button>
                    </div>
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-secondary/20 border border-border">
                        {links.map((lnk, i) => (
                          <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                            <span className="truncate max-w-[150px]">{lnk}</span>
                            <X className="h-3 w-3 cursor-pointer text-destructive hover:scale-110" onClick={() => handleRemoveLink(i)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image & Video Upload Options (only for POST type) */}
                  {form.type === "post" && (
                    <div className="space-y-4 pt-2 border-t border-border/60">
                      {/* Images upload */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary block">Images (Upload Multiple)</Label>
                        
                        {/* Paste Image URL option */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Paste image URL (https://...)"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPastedImage())}
                          />
                          <Button type="button" onClick={handleAddPastedImage} size="sm" variant="secondary" className="cursor-pointer">
                            Add URL
                          </Button>
                        </div>

                        {/* Local Image Upload option */}
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg border-border hover:border-primary/50 bg-secondary/20 cursor-pointer transition-colors">
                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                              <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                              <p className="text-xs text-muted-foreground"><span className="font-semibold">Click to upload images</span></p>
                            </div>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddImageFile} />
                          </label>
                        </div>

                        {/* Image Previews */}
                        {(pastedImages.length > 0 || imageFiles.length > 0) && (
                          <div className="grid grid-cols-4 gap-2 p-2 rounded-lg bg-secondary/20 border border-border">
                            {pastedImages.map((img, i) => (
                              <div key={`pasted-${i}`} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-black">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:scale-110 cursor-pointer"
                                  onClick={() => handleRemovePastedImage(i)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-white py-0.5 truncate px-1">URL</span>
                              </div>
                            ))}
                            {imageFiles.map((file, i) => {
                              const fileUrl = URL.createObjectURL(file);
                              return (
                                <div key={`file-${i}`} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-black">
                                  <img src={fileUrl} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:scale-110 cursor-pointer"
                                    onClick={() => handleRemoveImageFile(i)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-white py-0.5 truncate px-1">{file.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Videos upload */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary block">Videos (Upload Multiple)</Label>

                        {/* Paste Video URL option */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Paste video URL (https://...)"
                            value={newVideo}
                            onChange={(e) => setNewVideo(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPastedVideo())}
                          />
                          <Button type="button" onClick={handleAddPastedVideo} size="sm" variant="secondary" className="cursor-pointer">
                            Add URL
                          </Button>
                        </div>

                        {/* Local Video Upload option */}
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg border-border hover:border-primary/50 bg-secondary/20 cursor-pointer transition-colors">
                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                              <Film className="w-6 h-6 text-muted-foreground mb-1" />
                              <p className="text-xs text-muted-foreground"><span className="font-semibold">Click to upload videos</span></p>
                            </div>
                            <input type="file" multiple accept="video/*" className="hidden" onChange={handleAddVideoFile} />
                          </label>
                        </div>

                        {/* Video Files & Previews list */}
                        {(pastedVideos.length > 0 || videoFiles.length > 0) && (
                          <div className="space-y-1.5 p-2 rounded-lg bg-secondary/20 border border-border">
                            {pastedVideos.map((vid, i) => (
                              <div key={`pasted-vid-${i}`} className="flex items-center justify-between text-xs p-1.5 rounded bg-card border border-border">
                                <span className="truncate flex-1 text-muted-foreground">🔗 {vid}</span>
                                <button type="button" onClick={() => handleRemovePastedVideo(i)} className="text-destructive hover:scale-105 ml-2 cursor-pointer">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {videoFiles.map((file, i) => (
                              <div key={`file-vid-${i}`} className="flex items-center justify-between text-xs p-1.5 rounded bg-card border border-border">
                                <span className="truncate flex-1 font-medium">📄 {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                                <button type="button" onClick={() => handleRemoveVideoFile(i)} className="text-destructive hover:scale-105 ml-2 cursor-pointer">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-border/40">
                    <Button onClick={handleAdd} disabled={saving} className="cursor-pointer">
                      {saving ? "Uploading & Saving..." : "Save Content"}
                    </Button>
                    <Button variant="ghost" onClick={() => {
                      setAdding(false);
                      setForm({ type: "announcement", title: "", body: "" });
                      setLinks([]);
                      setPastedImages([]);
                      setImageFiles([]);
                      setPastedVideos([]);
                      setVideoFiles([]);
                    }} className="cursor-pointer">
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
