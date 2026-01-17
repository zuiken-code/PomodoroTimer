import { useState } from "react";

import { LoginGate } from "./components/LoginGate";

import App from "./App";

export default function Root() {
  const [isAllowed, setIsAllowed] = useState(() => {
    return localStorage.getItem("skipLogin") === "true";
  });

  if (!isAllowed) {
    return <LoginGate onContinue={() => setIsAllowed(true)} />;
  }

  return <App />;
}
