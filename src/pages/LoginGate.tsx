import { auth } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onContinue: () => void;
}

export function LoginGate({ onContinue }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
      localStorage.setItem("skipLogin", "true");
      onContinue();
    } catch (error) {
      setError("認証に失敗しました。ネットワーク状況を確認してください。");
      console.error(error);
    }
    // try {
    //   const provider = new GoogleAuthProvider();
    //   await signInWithPopup(auth, provider);
    //   onContinue();
    // } catch (e: any) {
    //   setError("認証に失敗しました。ネットワーク状況を確認してください。");
    // }
  }

  function continueWithoutLogin() {
    navigate("/");
    localStorage.setItem("skipLogin", "true");
    onContinue();
  }

  return (
    <div className="login-gate-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <span className="logo-icon">⚡</span>
            <h1>PomodoroTimer</h1>
          </div>
          <p className="login-subtitle">
            googleアカウントでログインすることで
            <br />
            より快適に使用することができます。
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
          <p>
            同期することで、作業データのバックアップが可能になります。(予定)
          </p>
        </div>
      </div>
    </div>
  );
}
