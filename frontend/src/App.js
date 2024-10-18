import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";

function App() {
  const [month, setMonth] = useState("03"); // Default to March
  return (
      <TransactionsTable month={month} />
  );
}

export default App;
