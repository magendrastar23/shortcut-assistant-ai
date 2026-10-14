import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  catalogue,
  clarificationOptions,
  getEntry,
  type CatalogueEntry,
  type MatchResult,
} from "@/lib/intent-catalogue";
import { interpretIntent, type IntentResolution } from "@/lib/intent-resolver.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-understanding")({
  validateSearch: (search: Record<string, unknown>) => ({
    request: typeof search["request"] === "string" ? search["request"] : "",
  }),
  component: AiUnderstanding,
});

function AiUnderstanding() {
  const navigate = useNavigate({ from: "/ai-understanding" });
  const { request } = Route.useSearch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<IntentResolution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSelectedId(null);

    interpretIntent({ data: { request } })
      .then((next) => {
        if (active) setResolution(next);
      })
      .catch(() => {
        if (active) {
          const fallback: MatchResult = { kind: "clarify" };
          setResolution({ result: fallback, source: "local_fallback" });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [request]);

  const result = resolution?.result ?? null;
  const needsChoice = !result || result.kind !== "match";
  const destination: CatalogueEntry | null =
    result?.kind === "match"
      ? result.entry
      : selectedId
        ? (getEntry(selectedId) ?? null)
        : null;
  const understood = destination?.intent ?? null;
  const confidence =
    result?.kind === "match"
      ? "High confidence"
      : selectedId
        ? "Needs confirmation"
        : null;
  const options =
    result?.kind === "none"
      ? catalogue.map((entry) => ({
          label: entry.intent.replace(/^Manage /, ""),
          id: entry.id,
        }))
      : clarificationOptions;

  const continueToDestination = () => {
    if (!destination) return;
    navigate({
      to: "/destination-result",
      search: { destination: destination.name, request },
    });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 pb-8 pt-5">
      <header className="flex items-center gap-2">
        <Button asChild variant="icon" size="icon" aria-label="Back to Home">
          <Link to="/" search={{ request }}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">AI Understanding</h1>
      </header>
      <p className="mt-1 px-1 text-sm text-muted-foreground">Here's what I understood</p>

      <section className="mt-5 rounded-2xl border border-ai/25 bg-card p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ai text-ai-foreground">
            <Sparkle className="size-5 fill-current" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Your request
            </h2>
            <p className="mt-1 text-base font-medium leading-6">{request}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            What I understood
          </h2>

          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Interpreting your request…
            </div>
          ) : needsChoice && !selectedId ? (
            <>
              <p className="mt-2 text-base font-semibold">
                {result?.kind === "none"
                  ? "No supported match found"
                  : "What would you like to manage?"}
              </p>
              <p
                className={cn(
                  "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  result?.kind === "none"
                    ? "bg-tile-red/15 text-tile-red"
                    : "bg-tile-gold/15 text-tile-gold",
                )}
              >
                {result?.kind === "none" ? "Low confidence" : "Needs clarification"}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {options.map(({ label, id }) => {
                  const entry = getEntry(id);
                  if (!entry) return null;
                  const Icon = entry.icon;
                  return (
                    <Button
                      key={id}
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedId(id)}
                      className="h-auto justify-start gap-2.5 rounded-xl px-3 py-3 text-left text-sm font-medium"
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-lg text-primary-foreground",
                          entry.tone,
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 whitespace-normal leading-4">{label}</span>
                    </Button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-base font-semibold">{understood}</p>
              {confidence && (
                <p
                  className={cn(
                    "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                    confidence === "High confidence"
                      ? "bg-ai/15 text-ai"
                      : "bg-tile-gold/15 text-tile-gold",
                  )}
                >
                  {confidence}
                </p>
              )}
            </>
          )}
        </div>

        {destination && (
          <div className="mt-5 rounded-xl border border-border bg-surface-raised p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Possible shortcut
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl text-primary-foreground",
                  destination.tone,
                )}
              >
                <destination.icon className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-sm font-semibold">{destination.name}</p>
                <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                  {destination.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && resolution && (
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            {resolution.source === "llm"
              ? "Interpreted with the configured AI model and validated against the approved catalogue."
              : "Using the local validated fallback matcher."}
          </p>
        )}
      </section>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          onClick={continueToDestination}
          disabled={!destination || loading}
          className="h-12 w-full text-base"
        >
          Continue
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full text-sm"
          onClick={() => navigate({ to: "/", search: { request } })}
        >
          Change request
        </Button>
      </div>
    </main>
  );
}
