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
      <h2>設定</h2>
      <p>{user.displayName}</p>
      <button onClick={handleLogout}>ログアウト</button>
      <br />
      <br />
      <button onClick={() => navigate("/")}>戻る</button>
    </div>
  );
};
