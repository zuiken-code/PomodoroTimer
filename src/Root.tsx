import { LoginGate } from "./components/LoginGate";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig"; // パスはご自身の環境に合わせてください
import App from "./App";
import { Settings } from "./pages/Settings";
import { AuthButton } from "./components/AuthButton";

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [isAllowed, setIsAllowed] = useState(() => {
    return localStorage.getItem("skipLogin") === "true";
  });
  // Firebaseのログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!isAllowed) {
    return <LoginGate onContinue={() => setIsAllowed(true)} />;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* どのページでも右上に表示されるボタン */}
      <AuthButton user={user} />

      <Routes>
        <Route path="/" element={<App user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
