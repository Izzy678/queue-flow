import { Suspense } from "react";
import { LegacyJoinPage } from "./join-page-client";

export const metadata = { title: "Join queue — QueueFlow" };

export default async function JoinPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const { queueId } = await params;

  return (
    <Suspense>
      <LegacyJoinPage queueId={queueId} />
    </Suspense>
  );
}
