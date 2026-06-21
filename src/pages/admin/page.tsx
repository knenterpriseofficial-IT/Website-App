import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, Eye, EyeOff, ArrowLeft, User, Lock, LogOut, Plus, Trash2, ChevronDown, ChevronUp, Image, Video, Link2, Megaphone, Tag, GraduationCap, BookOpen, Globe, Code2, Bot, Smartphone, Upload, X, File, Film } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/use-admin.tsx";
import ParticleBackground from "@/components/particle-background.tsx";

const SERVICES = [
  { id: "general", label: "General / Site-wide", icon: Megaphone },
  { id: "internship", label: "Internships", icon: GraduationCap },
  { id: "training", label: "Industrial Training", icon: BookOpen },
  { id: "websites", label: "Ready-made Websites", icon: Globe },
  { id: "custom-websites", label: "Custom Websites", icon: Code2 },
  { id: "ai-agents", label: "AI Agents", icon: Bot },
  { id: "mobile-apps", label: "Mobile Apps", icon: Smartphone },
];

const CONTENT_TYPES = [
  { value: "announcement", label: "Announcement" },
  { value: "offer", label: "Offer" },
  { value: "discount", label: "Discount" },
  { value: "post", label: "Post" },
];

function ServiceSection({ serviceId, label, icon: Icon, adminName }: {
  serviceId: string;
  label: string;
  icon: React.ElementType;
  adminName: string;
}) {
  const [expanded, setExpanded] = useState(false);
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

  const items = useQuery(api.content.listByService, { serviceId });
  const addContent = useMutation(api.content.addContentNoAuth);
  const deleteContent = useMutation(api.content.deleteContentNoAuth);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);

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
        adminName,
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

  const handleDelete = async (id: Id<"content">) => {
    try {
      await deleteContent({ id, adminName });
      toast.success("Removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const typeIcon = (type: string) => {
    if (type === "post") return <Image className="h-3.5 w-3.5" />;
    if (type === "offer" || type === "discount") return <Tag className="h-3.5 w-3.5" />;
    return <Megaphone className="h-3.5 w-3.5" />;
  };

  return (
    <Card className="border border-border">
      <CardHeader
        className="cursor-pointer select-none py-4"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <span>{label}</span>
            {items && items.length > 0 && (
              <Badge variant="secondary" className="text-xs">{items.length}</Badge>
            )}
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Existing items */}
          {items && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item: Doc<"content">) => (
                <div key={item._id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-primary">{typeIcon(item.type)}</span>
                      <span className="font-medium text-sm truncate">{item.title}</span>
                      <Badge variant="secondary" className="text-xs capitalize shrink-0">{item.type}</Badge>
                    </div>
                    {item.body && <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{item.body}</p>}
                    
                    {/* Render Links Summary */}
                    {item.links && item.links.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.links.map((lnk, i) => (
                          <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full truncate max-w-[200px]" title={lnk}>
                            🔗 {lnk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Render Images Summary */}
                    {item.images && item.images.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="h-8 w-8 object-cover rounded-md border border-border" />
                        ))}
                      </div>
                    )}

                    {/* Render Videos Summary */}
                    {item.videos && item.videos.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          🎥 {item.videos.length} Video(s)
                        </span>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground mt-1">Added by {item.createdBy}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add form */}
          {adding ? (
            <div className="p-4 rounded-xl border border-primary/30 bg-card/80 space-y-4">
              <p className="text-sm font-semibold text-primary">Add New Content</p>

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
                <Input
                  placeholder="Enter a title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs mb-1 block">Description (optional)</Label>
                <Input
                  placeholder="Enter description or details"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
              </div>

              {/* Multiple Links Option (for all content types) */}
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
            <Button
              size="sm"
              onClick={() => setAdding(true)}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Content
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { session } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Logged in as <span className="text-primary font-semibold">{session?.name}</span>
          </p>
        </div>
        <Button variant="secondary" onClick={onLogout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" /> Log Out
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary">
        <strong>Tip:</strong> Click any section to expand it. Add images, videos, links, offers, announcements, or any content — it appears instantly on the website.
      </div>

      <div className="space-y-3">
        {SERVICES.map((svc) => (
          <ServiceSection
            key={svc.id}
            serviceId={svc.id}
            label={svc.label}
            icon={svc.icon}
            adminName={session?.name ?? "Admin"}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { session, login, logout } = useAdmin();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!userId.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.");
      return;
    }
    const ok = login(userId.trim(), password.trim());
    if (!ok) setError("Invalid User ID or Password. Please try again.");
  };

  const handleLogout = () => {
    logout();
    setUserId("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Site</span>
          </button>
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            <span>Admin Panel</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {session ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 rounded-2xl bg-card border border-primary/30 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                  <img
                    src="/web-logo.png"
                    alt="K&N"
                    className="h-16 w-16 rounded-full object-cover mb-4 border-2 border-primary"
                  />
                  <h2 className="text-2xl font-black">Admin Login</h2>
                  <p className="text-sm text-muted-foreground mt-1">K&N Enterprises</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="userId"
                        placeholder="Enter your User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                  )}

                  <Button onClick={handleLogin} className="w-full cursor-pointer">
                    Log In
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
