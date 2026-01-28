"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export function AbsenceNoticeBanner() {
  const [notice, setNotice] = useState<{ enabled: boolean; text: string | null }>({
    enabled: false,
    text: null,
  });

  useEffect(() => {
    fetch("/api/public-config")
      .then((res) => res.json())
      .then((data: { absenceNoticeEnabled?: boolean; absenceNoticeText?: string | null }) => {
        setNotice({
          enabled: !!data.absenceNoticeEnabled,
          text: typeof data.absenceNoticeText === "string" ? data.absenceNoticeText : null,
        });
      })
      .catch(() => setNotice({ enabled: false, text: null }));
  }, []);

  if (!notice.enabled || !notice.text?.trim()) return null;

  return (
    <div
      className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-100 py-3 px-4"
      role="status"
    >
      <div className="container mx-auto flex items-center gap-3 max-w-4xl">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm font-medium">{notice.text.trim()}</p>
      </div>
    </div>
  );
}
