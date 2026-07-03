import { BranchDisplay } from "@/components/dashboard/branch-display";

export const metadata = { title: "Lobby display — QueueFlow" };

export default async function BranchDisplayPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  return <BranchDisplay branchId={branchId} />;
}
