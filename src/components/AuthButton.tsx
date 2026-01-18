import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface AuthButtonProps {
  user: User | null;
}

export const AuthButton = ({ user }: AuthButtonProps) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate("/login");
    // try {
    //   await signInWithPopup(auth, googleProvider);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div
      style={{ position: "absolute", top: "10px", right: "10px", zIndex: 100 }}
    >
      {user ? (
        <div
          onClick={() => navigate("/settings")}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#6750A4",
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="user" style={{ width: "100%" }} />
          ) : (
            <span style={{ color: "white" }}>
              {user.displayName?.charAt(0)}
            </span>
          )}
        </div>
      ) : (
        <button onClick={handleLogin} className="btn-primary">
          ログイン
        </button>
      )}
    </div>
  );
};
