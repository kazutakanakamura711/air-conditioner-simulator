"use client";

import { useMemo, useState } from "react";
import { createSimulation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SimulationParams } from "@/types/simulation";

type ShareButtonProps = {
  params: SimulationParams;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ja-JP");
}

export function ShareButton({ params }: ShareButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCopy = useMemo(
    () => typeof navigator !== "undefined" && Boolean(navigator.clipboard),
    [],
  );

  const handleCreateShareUrl = async () => {
    setError(null);
    setCopied(false);
    setIsSaving(true);

    try {
      const res = await createSimulation(params);
      setShareUrl(res.url);
      setExpiresAt(res.expiresAt);
    } catch {
      setError("共有URLの作成に失敗しました。時間をおいて再試行してください。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl || !canCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("URLのコピーに失敗しました。手動でコピーしてください。");
    }
  };

  return (
    <Card className="rounded-3xl bg-slate-950/70">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl">結果を共有</CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-300">
              現在の入力条件を保存し、共有URLを発行します。
            </CardDescription>
          </div>

          <Button
            type="button"
            onClick={handleCreateShareUrl}
            disabled={isSaving}
          >
            {isSaving ? "保存中..." : "共有URLを作成"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {shareUrl ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400">共有URL</p>
            <a
              className="mt-1 block break-all text-sm text-emerald-300 hover:text-emerald-200"
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shareUrl}
            </a>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleCopy}
                disabled={!canCopy}
                variant="outline"
                size="sm"
              >
                {copied ? "コピーしました" : "URLをコピー"}
              </Button>
              {expiresAt ? (
                <span className="text-xs text-slate-400">
                  有効期限: {formatDate(expiresAt)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
