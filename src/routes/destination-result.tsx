import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { catalogue, getEntry, getEntryByName } from "@/lib/intent-catalogue";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/destination-result")({
  validateSearch: (search: Record<string, unknown>) => ({
    destination: typeof search["destination"] === "string" ? search["destination"] : "",
    request: typeof search["request"] === "string" ? search["request"] : "",
  }),
  component: DestinationResult,
});

function DestinationResult() {
  const navigate = useNavigate({ from: "/destination-result" });
  const { destination: requestedDestination, request } = Route.useSearch();
  const [showAlternatives, setShowAlternatives] = useState(false);

  const primary = getEntryByName(requestedDestination) ?? catalogue[0]!;
  const [selectedName, setSelectedName] = useState(primary.name);
  const selectedDestination = getEntryByName(selectedName) ?? primary;
  const alternatives = primary.related
    .map((id) => getEntry(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const SelectedIcon = selectedDestination.icon;
  const displayRequest = request || "I want to turn on Wi-Fi";

  const confirmDestination = () => {
    navigate({
      to: "/navigation-confirmation",
      search: { destination: selectedDestination.name, request: displayRequest },
    });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 pb-8 pt-5">
      <header className="flex items-center gap-2">
        <Button asChild variant="icon" size="icon" aria-label="Back to AI Understanding">
          <Link to="/ai-understanding" search={{ request: displayRequest }}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Destination Found</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Review before opening</p>
        </div>
      </header>

      <section className="mt-6 rounded-2xl border border-ai/25 bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recommended destination
        </p>
        <div className="mt-4 flex items-start gap-4">
          <span className={cn(
            "grid size-14 shrink-0 place-items-center rounded-2xl text-primary-foreground",
            selectedDestination.tone,
          )}>
            <SelectedIcon className="size-7" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 className="text-lg font-bold leading-6">{selectedDestination.name}</h2>
            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              {selectedDestination.description}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-ai">
          <CheckCircle2 className="size-4" />
          Verified destination
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface-raised p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Based on your request
        </h2>
        <p className="mt-2 text-sm font-medium leading-5">“{displayRequest}”</p>
      </section>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Matched from supported device settings
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button type="button" onClick={confirmDestination} className="h-12 w-full text-base">
          Open {selectedDestination.name}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAlternatives((current) => !current)}
          aria-expanded={showAlternatives}
          className="h-11 w-full"
        >
          Choose another result
          <ChevronDown className={cn("size-4 transition-transform", showAlternatives && "rotate-180")} />
        </Button>
      </div>

      {showAlternatives && (
        <section className="mt-4" aria-label="Alternative results">
          <h2 className="mb-2 px-1 text-sm font-semibold">Approved alternatives</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {alternatives.map((item, index) => {
              const Icon = item.icon;
              const selected = item.name === selectedDestination.name;
              return (
                <Button
                  key={item.name}
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedName(item.name)}
                  className={cn(
                    "h-auto w-full justify-start rounded-none px-4 py-3 text-left text-foreground",
                    index > 0 && "border-t border-border",
                    selected && "bg-muted",
                  )}
                  aria-pressed={selected}
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg text-primary-foreground", item.tone)}>
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="mt-0.5 block text-xs font-normal leading-4 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  {selected && <Check className="size-4 shrink-0 text-ai" />}
                </Button>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
