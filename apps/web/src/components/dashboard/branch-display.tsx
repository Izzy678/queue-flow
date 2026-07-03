"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowLeft, Loader2, Monitor } from "lucide-react";
import type { BranchJoinToken } from "@queueflow/shared";
import { createBranchJoinToken } from "@/lib/api-client";

const REFRESH_MS = 9 * 60 * 1000;

export function BranchDisplay({ branchId }: { branchId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tokenData, setTokenData] = useState<BranchJoinToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const refreshToken = useCallback(async () => {
    try {
      const data = await createBranchJoinToken(branchId);
      setTokenData(data);
      setError(null);

      const expiresAt = new Date(data.expiresAt).getTime();
      setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    refreshToken();
    const refreshInterval = setInterval(refreshToken, REFRESH_MS);
    return () => clearInterval(refreshInterval);
  }, [refreshToken]);

  useEffect(() => {
    if (loading || !tokenData?.joinUrl || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, tokenData.joinUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => {
      setError("Failed to render QR code");
    });
  }, [tokenData?.joinUrl, loading]);

  useEffect(() => {
    if (!tokenData) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(tokenData.expiresAt).getTime();
      setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenData]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 text-white">
      <Link
        href="/dashboard/branches"
        className="absolute left-6 top-6 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit display
      </Link>

      <div className="flex flex-col items-center text-center max-w-lg">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Monitor className="h-7 w-7" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Scan to join the queue</h1>
        <p className="text-white/60 mb-10">
          Open your camera, scan the code, and choose your service
        </p>

        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <>
            <div className="rounded-2xl bg-white p-4 mb-6">
              <canvas ref={canvasRef} />
            </div>
            <p className="text-sm text-white/50 mb-1">Code refreshes automatically</p>
            <p className="font-mono text-lg text-white/80">
              {minutes}:{seconds.toString().padStart(2, "0")} remaining
            </p>
          </>
        )}
      </div>
    </div>
  );
}
