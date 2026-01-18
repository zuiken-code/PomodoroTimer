import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

interface SettingsProps {
  user: User | null;
}

export const Settings = ({ user }: SettingsProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>アカウント設定</h2>
      <p>ユーザー名: {user.displayName}</p>
      <button onClick={handleLogout} className="btn-danger">
        ログアウト
      </button>
      <br />
      <br />
      <button onClick={() => navigate("/")} className="btn-primary">
        戻る
      </button>
    </div>
  );
};
