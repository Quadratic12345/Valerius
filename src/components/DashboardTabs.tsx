"use client";

import { useState } from "react";

export default function DashboardTabs({
  overview,
  activity,
}: {
  overview: React.ReactNode;
  activity: React.ReactNode;
}) {
  const [tab, setTab] = useState<"overview" | "activity">("overview");

  return (
    <>
      <div className="seg-control">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`seg-btn ${tab === "overview" ? "active" : ""}`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("activity")}
          className={`seg-btn ${tab === "activity" ? "active" : ""}`}
        >
          Activity
        </button>
      </div>

      <div className="w-full flex flex-col items-center gap-8 rise-in" key={tab}>
        {tab === "overview" ? overview : activity}
      </div>
    </>
  );
}