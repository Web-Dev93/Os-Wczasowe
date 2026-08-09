import React, { useState } from "react";
import {
  useAdminListPosts,
  useAdminCreatePost,
  useAdminUpdatePost,
  useAdminDeletePost,
  getAdminListPostsQueryKey,
} from "@workspace/api-client-react";
import type { Post } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AdminTip } from "@/components/ui/admin-help";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Newspaper, X, Save, ImageIcon
} from "lucide-react";

type FormState = { title: string; content: string; imageUrl: string; isPublished: boolean };
const EMPTY_FORM: FormState = { title: "", content: "", imageUrl: "", isPublished: true };

function formatDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminPosts() {
  const { data: posts, isLoading } = useAdminListPosts();
  const createPost = useAdminCreatePost();
  const updatePost = useAdminUpdatePost();
  const deletePost = useAdminDeletePost();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getAdminListPostsQueryKey() });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content ?? "",
      imageUrl: post.imageUrl ?? "",
      isPublished: post.isPublished,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Tytuł jest wymagany", variant: "destructive" });
      return;
    }
    const data = {
      title: form.title.trim(),
      content: form.content.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      isPublished: form.isPublished,
    };
    if (editing) {
      updatePost.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => {
            toast({ title: "Wpis zaktualizowany ✓" });
            invalidate();
            closeForm();
          },
          onError: () => toast({ title: "Błąd podczas zapisywania", variant: "destructive" }),
        }
      );
    } else {
      createPost.mutate(
        { data },
        {
          onSuccess: () => {
            toast({ title: "Wpis dodany ✓" });
            invalidate();
            closeForm();
          },
          onError: () => toast({ title: "Błąd podczas dodawania", variant: "destructive" }),
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;
    deletePost.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Wpis usunięty" });
          invalidate();
        },
        onError: () => toast({ title: "Błąd podczas usuwania", variant: "destructive" }),
      }
    );
  };

  const togglePublish = (post: Post) => {
    updatePost.mutate(
      {
        id: post.id,
        data: {
          title: post.title,
          content: post.content ?? undefined,
          imageUrl: post.imageUrl ?? undefined,
          isPublished: !post.isPublished,
        },
      },
      {
        onSuccess: () => {
          toast({ title: post.isPublished ? "Wpis ukryty" : "Wpis opublikowany ✓" });
          invalidate();
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Aktualności</h1>
          <p className="text-muted-foreground mt-1">Wiadomości i wpisy na stronie głównej</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Dodaj wpis
        </Button>
      </div>

      <AdminTip text="Wpisy z aktualności pojawiają się na stronie głównej Twojego ośrodka. Możesz informować gości o nowych atrakcjach, promocjach, zmianach sezonowych. Ukryte wpisy są widoczne tylko dla Ciebie — gości nie widzą." />

      {/* Form */}
      {showForm && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Newspaper className="w-5 h-5 text-primary" />
              {editing ? "Edytuj wpis" : "Nowy wpis"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={closeForm}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Tytuł <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Np. Sezon letni otwarty!"
                  required
                />
                <AdminTip text="Tytuł wyświetla się jako nagłówek wpisu na stronie głównej. Napisz coś zwięzłego i zachęcającego." />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Treść</label>
                <Textarea
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Opisz nowość, promocję lub informację dla gości..."
                  rows={5}
                />
                <AdminTip text="Możesz napisać kilka zdań lub dłuższy akapit. Gość zobaczy cały tekst na stronie głównej." />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">URL zdjęcia (opcjonalnie)</label>
                <Input
                  value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                />
                <AdminTip text="Wklej link do zdjęcia z internetu (np. z Unsplash.com) lub własnego serwera. Zdjęcie pojawi się obok tekstu wpisu." />
                {form.imageUrl && (
                  <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={form.imageUrl}
                      alt="Podgląd"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                  Opublikuj (widoczny dla gości)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={createPost.isPending || updatePost.isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  {editing ? "Zapisz zmiany" : "Dodaj wpis"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>Anuluj</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className={`transition-opacity ${post.isPublished ? "" : "opacity-60"}`}>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  {post.imageUrl && (
                    <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!post.imageUrl && (
                    <div className="shrink-0 w-20 h-20 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6 opacity-40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base leading-snug truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(post.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant={post.isPublished ? "default" : "secondary"} className="text-xs">
                          {post.isPublished ? "Opublikowany" : "Ukryty"}
                        </Badge>
                      </div>
                    </div>
                    {post.content && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.content}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edytuj
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => togglePublish(post)}
                        disabled={updatePost.isPending}
                      >
                        {post.isPublished
                          ? <><EyeOff className="w-3.5 h-3.5" /> Ukryj</>
                          : <><Eye className="w-3.5 h-3.5" /> Opublikuj</>}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Usuń
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl gap-3">
          <Newspaper className="w-12 h-12 opacity-30" />
          <p className="text-sm">Brak wpisów. Dodaj pierwszy!</p>
          <Button variant="outline" onClick={openNew} className="mt-2 gap-2">
            <Plus className="w-4 h-4" /> Dodaj wpis
          </Button>
        </div>
      )}
    </div>
  );
}
