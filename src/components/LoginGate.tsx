import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

interface Props {
  onContinue: () => void;
}

export function LoginGate({ onContinue }: Props) {
  const [error, setError] = useState("");

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onContinue(); // ← ログイン成功
    } catch (e: any) {
      setError(e.message);
    }
  }

  function continueWithoutLogin() {
    localStorage.setItem("skipLogin", "true");
    onContinue();
  }

  return (
    <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "center" }}>
      <h2>ログインしますか？</h2>

      <button onClick={loginWithGoogle}>Googleでログイン</button>

      <button onClick={continueWithoutLogin}>ログインせずに使う</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
