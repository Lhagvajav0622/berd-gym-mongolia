"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="hover:text-fg disabled:opacity-50"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const { error } = await authClient.signOut();
        if (error) {
          setBusy(false);
          alert("Гарч чадсангүй. Хуудсаа дахин ачаалаад оролдоно уу.");
          return;
        }
        // Full reload so no page keeps showing the old login.
        window.location.href = "/";
      }}
    >
      {busy ? "…" : "Гарах"}
    </button>
  );
}
