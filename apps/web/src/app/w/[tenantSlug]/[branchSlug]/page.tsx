import { Suspense } from "react";
import { BranchQueuePicker } from "@/components/join/branch-queue-picker";

export const metadata = { title: "Join queue — QueueFlow" };

export default async function BranchJoinPage({
  params,
}: {
  params: Promise<{ tenantSlug: string; branchSlug: string }>;
}) {
  const { tenantSlug, branchSlug } = await params;

  return (
    <Suspense>
      <BranchQueuePicker tenantSlug={tenantSlug} branchSlug={branchSlug} />
    </Suspense>
  );
}
