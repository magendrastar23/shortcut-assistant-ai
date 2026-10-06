import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MessageSquareText, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { catalogue, getEntryByName } from "@/lib/intent-catalogue";

export const Route = createFileRoute("/navigation-confirmation")({
  validateSearch: (search: Record<string, unknown>) => ({
    destination: typeof search["destination"] === "string" ? search["destination"] : "",
    request: typeof search["request"] === "string" ? search["request"] : "",
  }),
  component: NavigationConfirmation,
});

function NavigationConfirmation() {
  const { destination: rawDestination, request: rawRequest } = Route.useSearch();
  const approvedDestination = getEntryByName(rawDestination) ?? catalogue[0]!;
  const destination = approvedDestination.name;
  const request = rawRequest || "I want to turn on Wi-Fi";

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 pb-8 pt-5">
      <header className="flex items-center gap-2">
        <Button asChild variant="icon" size="icon" aria-label="Back to Destination Found">
          <Link to="/destination-result" search={{ destination, request }}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Ready to Open</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Confirmed and validated</p>
        </div>
      </header>

      <div className="mt-10 flex flex-col items-center text-center">
        <div className="grid size-20 place-items-center rounded-3xl bg-ai text-ai-foreground">
          <CheckCircle2 className="size-10" strokeWidth={1.8} />
        </div>
        <h2 className="mt-5 text-2xl font-bold leading-tight">{destination} is ready</h2>
        <p className="mt-2 max-w-xs text-sm leading-5 text-muted-foreground">
          Your destination was validated and confirmed.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <dl className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your request</dt>
              <dd className="mt-1 text-sm font-medium leading-5">“{request}”</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <Navigation className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destination</dt>
              <dd className="mt-1 text-sm font-medium leading-5">{destination}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ai" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1 text-sm font-semibold leading-5 text-ai">Confirmed</dd>
            </div>
          </div>
        </dl>
      </section>

      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
        Nothing was opened automatically. You confirmed this action.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button asChild className="h-12 w-full text-base">
          <Link to="/" search={{ request: "" }}>Done</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 w-full text-sm">
          <Link to="/destination-result" search={{ destination, request }}>Back to result</Link>
        </Button>
      </div>
    </main>
  );
}
