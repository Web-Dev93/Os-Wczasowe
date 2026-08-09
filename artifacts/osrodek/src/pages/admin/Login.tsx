import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin, useAdminGetMe } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";

const loginSchema = z.object({
  password: z.string().min(1, "Hasło jest wymagane"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = useAdminGetMe({ query: { retry: false } });
  const loginMutation = useAdminLogin();
  const { toast } = useToast();
  const [demoLoading, setDemoLoading] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) setLocation("/admin");
  }, [user, setLocation]);

  // Auto-login in demo mode (?demo=1 in URL)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;

    setDemoLoading(true);
    fetch("/api/admin/demo-login", { method: "POST", credentials: "include" })
      .then((r) => r.json())
      .then(() => setLocation("/admin"))
      .catch(() => setDemoLoading(false));
  }, [setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: { password: values.password } }, {
      onSuccess: () => {
        toast({ title: "Zalogowano pomyślnie" });
        setLocation("/admin");
      },
      onError: () => {
        toast({ title: "Błędne hasło", variant: "destructive" });
        form.reset();
      }
    });
  };

  if (isLoading || demoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-card-foreground">Panel Administratora</h1>
          <p className="text-muted-foreground mt-2">Wprowadź hasło aby uzyskać dostęp</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
