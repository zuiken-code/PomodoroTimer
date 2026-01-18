import { auth } from "../firebase/firebaseConfig";
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
      onContinue();
    } catch (e: any) {
      setError("認証に失敗しました。ネットワーク状況を確認してください。");
    }
  }

  function continueWithoutLogin() {
    localStorage.setItem("skipLogin", "true");
    onContinue();
  }

  return (
    <div className="login-gate-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <span className="logo-icon">⚡</span>
            <h1>NEURAL FOCUS</h1>
          </div>
          <p className="login-subtitle">
            ワークセッションを開始するために
            <br />
            アカウントを同期してください。
          </p>
        </div>

        <div className="login-body">
          <button className="google-login-btn" onClick={loginWithGoogle}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
            />
            Googleアカウントで続行
          </button>

          <button
            className="secondary-outline-btn"
            onClick={continueWithoutLogin}
          >
            ログインせずに一時利用する
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="login-footer">
          <p>同期することで、作業データのバックアップが可能になります。</p>
        </div>
      </div>
    </div>
  );
}
