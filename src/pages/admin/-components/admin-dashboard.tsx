import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";
import { motion } from "motion/react";
import {
  Plus, Trash2, GraduationCap, BookOpen, Globe, Code2,
  Bot, Smartphone, Megaphone, ChevronDown, ChevronUp, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";

const SERVICES = [
  { id: "general", label: "General / Site-wide", icon: Megaphone },
  { id: "internship", label: "Internships", icon: GraduationCap },
  { id: "training", label: "Industrial Training", icon: BookOpen },
  { id: "websites", label: "Ready-made Websites", icon: Globe },
  { id: "custom-websites", label: "Custom Websites", icon: Code2 },
  { id: "ai-agents", label: "AI Agents", icon: Bot },
  { id: "mobile-apps", label: "Mobile Apps", icon: Smartphone },
];

const CONTENT_TYPES = ["announcement", "offer", "discount", "poster", "image", "video", "link"];

function ServiceSection({ serviceId, label, icon: Icon }: { serviceId: string; label: string; icon: React.ElementType }) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ type: "announcement", title: "", body: "", url: "" });

  const items = useQuery(api.content.listByService, { serviceId });
  const addContent = useMutation(api.content.addContent);
  const deleteContent = useMutation(api.content.deleteContent);

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    try {
      await addContent({
        serviceId,
        type: form.type,
        title: form.title,
        body: form.body || undefined,
        url: form.url || undefined,
      });
      toast.success("Content added!");
      setForm({ type: "announcement", title: "", body: "", url: "" });
      setAdding(false);
    } catch {
      toast.error("Failed to add content");
    }
  };

  const handleDelete = async (id: Id<"content">) => {
    try {
      await deleteContent({ id });
      toast.success("Removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <span>{label}</span>
            {items && items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </div>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Existing items */}
          {items && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item: Doc<"content">) => (
                <div key={item._id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{item.title}</span>
                      <Badge variant="secondary" className="text-xs capitalize shrink-0">{item.type}</Badge>
                    </div>
                    {item.body && <p className="text-xs text-muted-foreground truncate">{item.body}</p>}
                    {item.url && <p className="text-xs text-primary truncate">{item.url}</p>}
                    <p className="text-xs text-muted-foreground mt-1">By {item.createdBy}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive cursor-pointer"
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
            <div className="p-4 rounded-xl border border-primary/30 bg-card space-y-3">
              <div>
                <Label>Type</Label>
                <select
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input className="mt-1" placeholder="Enter title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Input className="mt-1" placeholder="Enter description" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>
              <div>
                <Label>URL / Link (optional)</Label>
                <Input className="mt-1" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="cursor-pointer">Save</Button>
                <Button variant="ghost" onClick={() => setAdding(false)} className="cursor-pointer">Cancel</Button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
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

export default function AdminDashboard() {
  const { signout, user } = useAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Logged in as <span className="text-primary font-semibold">{currentUser?.name ?? user?.profile.name ?? "Admin"}</span>
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={signout}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary">
        <strong>Instructions:</strong> Click any section below to expand it. You can add announcements, offers, discounts, images, videos, or links to any service section. Changes are visible to all visitors immediately.
      </div>

      {/* Service sections */}
      <div className="space-y-3">
        {SERVICES.map((svc) => (
          <ServiceSection
            key={svc.id}
            serviceId={svc.id}
            label={svc.label}
            icon={svc.icon}
          />
        ))}
      </div>
    </motion.div>
  );
}
