import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AppWindow, BellRing, Boxes, Code2, ContactRound, FileText, Folder, FolderHeart,
  Globe2, Heart, HelpCircle, History, LayoutGrid, MessageSquareText, MoreVertical,
  Search, Settings, SlidersHorizontal, Sparkle, SplitSquareVertical, Star, type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    request: typeof search["request"] === "string" ? search["request"] : "",
  }),
  component: Index,
});

type Category = { label: string; icon: LucideIcon; tone: string };

const categories: Category[] = [
  { label: "Apps", icon: AppWindow, tone: "bg-tile-blue" },
  { label: "Activities", icon: BellRing, tone: "bg-tile-violet" },
  { label: "Contacts", icon: ContactRound, tone: "bg-tile-rose" },
  { label: "Messages", icon: MessageSquareText, tone: "bg-tile-orange" },
  { label: "Folders", icon: Folder, tone: "bg-tile-green" },
  { label: "Files", icon: FileText, tone: "bg-tile-cyan" },
  { label: "Settings", icon: Settings, tone: "bg-tile-gold" },
  { label: "Intents", icon: Code2, tone: "bg-tile-red" },
  { label: "Website", icon: Globe2, tone: "bg-tile-cyan" },
  { label: "App Shortcuts", icon: LayoutGrid, tone: "bg-tile-violet" },
  { label: "Split", icon: SplitSquareVertical, tone: "bg-tile-blue" },
  { label: "Actions", icon: Boxes, tone: "bg-tile-green" },
];

const quickOptions = [
  { label: "History", icon: History },
  { label: "Favorites", icon: Star },
  { label: "App Settings", icon: SlidersHorizontal },
  { label: "Help", icon: HelpCircle },
];

function Index() {
  const navigate = useNavigate({ from: "/" });
  const { request: retainedRequest } = Route.useSearch();
  const [request, setRequest] = useState(retainedRequest);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanRequest = request.trim();
    if (!cleanRequest) return;
    navigate({ to: "/ai-understanding", search: { request: cleanRequest } });
  };

  const showExistingNotice = () =>
    setNotice("This section is part of the existing Shortcut Maker experience.");

  return (
    <main className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background pb-8">
      <header className="flex items-center justify-between px-5 pb-4 pt-5">
        <h1 className="text-[2rem] font-bold leading-none">Shortcuts</h1>
        <div className="flex items-center gap-1">
          <Button variant="icon" size="icon" aria-label="Search" onClick={showExistingNotice}>
            <Search className="size-5" />
          </Button>
          <Button variant="icon" size="icon" aria-label="More options" onClick={showExistingNotice}>
            <MoreVertical className="size-5" />
          </Button>
        </div>
      </header>

      <section className="px-4">
        <form onSubmit={submitRequest} className="rounded-2xl border border-ai/25 bg-card p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai text-ai-foreground">
              <Sparkle className="size-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold">Find a shortcut with AI</h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Tell us what you want to do — no technical terms needed.
              </p>
            </div>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">Try “I want to turn on Wi-Fi”</p>
          <div className="flex items-center rounded-xl border border-input bg-background p-1.5">
            <Search className="ml-2 size-4 text-muted-foreground" />
            <input
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
              placeholder="What do you want to do?"
              aria-label="Shortcut request"
            />
            <Button type="submit" size="compact" disabled={!request.trim()}>
              Find Shortcut
            </Button>
          </div>
        </form>
      </section>

      <section className="px-4 pb-1 pt-6" aria-label="Shortcut categories">
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {categories.map(({ label, icon: Icon, tone }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              onClick={() =>
                label === "Settings"
                  ? navigate({ to: "/settings" })
                  : showExistingNotice()
              }
              className="h-auto min-w-0 flex-col gap-2 rounded-xl p-0 text-foreground hover:bg-transparent"
            >
              <span className={cn("grid size-14 place-items-center rounded-2xl shadow-sm", tone)}>
                <Icon className="size-6 text-primary-foreground" strokeWidth={1.8} />
              </span>
              <span className="min-h-8 w-full text-center text-[11px] font-medium leading-4 whitespace-normal">
                {label}
              </span>
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-5 border-y border-border bg-surface-raised">
        <Button type="button" variant="ghost" onClick={showExistingNotice}
          className="h-auto w-full justify-start rounded-none px-5 py-4 text-left text-foreground">
          <span className="grid size-11 place-items-center rounded-xl bg-tile-violet text-primary-foreground">
            <FolderHeart className="size-5" />
          </span>
          <span><span className="block text-sm font-semibold">Shortcut Collections</span>
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Folder of apps and shortcuts</span></span>
        </Button>
        <div className="mx-5 border-t border-border" />
        <Button type="button" variant="ghost" onClick={showExistingNotice}
          className="h-auto w-full justify-start rounded-none px-5 py-4 text-left text-foreground">
          <span className="grid size-11 place-items-center rounded-xl bg-tile-rose text-primary-foreground">
            <Heart className="size-5 fill-current" />
          </span>
          <span><span className="block text-sm font-semibold">Donate ❤️</span>
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Contribute to development via donations</span></span>
        </Button>
      </section>

      <nav className="grid grid-cols-4 px-2 pt-5">
        {quickOptions.map(({ label, icon: Icon }) => (
          <Button key={label} type="button" variant="ghost" onClick={showExistingNotice}
            className="h-auto min-w-0 flex-col gap-2 px-1 py-2 text-muted-foreground">
            <Icon className="size-5" /><span className="text-[11px] whitespace-normal">{label}</span>
          </Button>
        ))}
      </nav>

      <div role="status" aria-live="polite"
        className={cn(
          "fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg bg-foreground px-4 py-3 text-center text-sm font-medium text-background shadow-xl transition-all",
          notice ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}>
        {notice}
      </div>
    </main>
  );
}
