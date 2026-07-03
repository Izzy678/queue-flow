"use client";

import { useSearchParams } from "next/navigation";
import { JoinQueuePage } from "@/components/join/join-queue-page";

export function LegacyJoinPage({ queueId }: { queueId: string }) {
  const searchParams = useSearchParams();
  const joinToken = searchParams.get("t") ?? searchParams.get("token") ?? "";

  if (!joinToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-sm font-medium">Scan the QR code at the branch</p>
          <p className="text-sm text-muted">
            To join a queue, scan the code displayed on the screen in the lobby.
            Direct links are no longer supported without a valid QR session.
          </p>
        </div>
      </div>
    );
  }

  return <JoinQueuePage queueId={queueId} joinToken={joinToken} />;
}
