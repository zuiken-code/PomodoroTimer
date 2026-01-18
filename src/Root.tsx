import { LoginGate } from "./pages/LoginGate";

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
    <div style={{ minHeight: "100vh", textAlign: "center" }}>
      {/* ヘッダーエリア：要素を縦に並べる */}
      <header
        style={{
          padding: "10px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 中央寄せ
          gap: "10px", // ボタンとタイトルの間の隙間
        }}
      >
        {/* 1段目：ログインボタン/アイコン */}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <AuthButton user={user} />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<App user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="login"
          element={<LoginGate onContinue={() => setIsAllowed(true)} />}
        />
      </Routes>
    </div>
  );
}
