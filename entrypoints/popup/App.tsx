import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import React from "react";
import AutoReplyPopup from "./AutoReplyPopup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <AutoReplyPopup />
    </div>
  );
}

export default App;
