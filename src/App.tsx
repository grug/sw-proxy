import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    fetch(
      "https://api.thecatapi.com/v1/images/search?api_key=a56959a4-3749-4be6-8f5e-c53202a436b4"
    )
      .then((r) => r.json())
      .then((r) => console.log("in component", r));
  }, []);

  useEffect(() => {
    var oReq = new XMLHttpRequest();
    oReq.open(
      "GET",
      "https://api.thecatapi.com/v1/images/search?api_key=a56959a4-3749-4be6-8f5e-c53202a436b4"
    );
    oReq.send();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
