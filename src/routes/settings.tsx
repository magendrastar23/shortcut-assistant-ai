import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-5">
      <Button asChild variant="icon" size="icon" aria-label="Back to Home">
        <Link to="/" search={{ request: "" }}>
          <ArrowLeft className="size-5" />
        </Link>
      </Button>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-muted text-foreground">
          <SettingsIcon className="size-8" />
        </div>
        <p className="mb-2 text-sm font-medium text-primary">Existing path</p>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-3 text-muted-foreground">Settings path preserved for the prototype.</p>
      </div>
    </main>
  );
}
