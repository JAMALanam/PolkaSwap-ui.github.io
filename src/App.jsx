import React from "react";
import "./index.css";
import PolkaSwap from "./PolkaSwap-swap-ui";

export default function App() {
  return (
    <>
      <div className="particles"></div>
      <div className="relative z-10">
        <PolkaSwap />
      </div>
    </>
  );
}
