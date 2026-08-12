"use client";

import { useState } from "react";

export default function DashboardTabs({
  overview,
  activity,
  contacts,
}: {
  overview: React.ReactNode;
  activity: React.ReactNode;
  contacts: React.ReactNode;
}) {
  const [tab, setTab] = useState<"overview" | "activity" | "contacts">("overview");

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
        <button
          type="button"
          onClick={() => setTab("contacts")}
          className={`seg-btn ${tab === "contacts" ? "active" : ""}`}
        >
          Contacts
        </button>
      </div>

      <div className="w-full flex flex-col items-center gap-8 rise-in" key={tab}>
        {tab === "overview" ? overview : tab === "activity" ? activity : contacts}
      </div>
    </>
  );
}