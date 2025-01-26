import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RegistrationPage from "./RegistrationPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Pavan</h1>
      <RegistrationPage />
    </>
  );
}

export default App;
