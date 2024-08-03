import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Coming Soon!!!</h1>
        <p>
          I want to build a website that will help you to learn programming.
        </p>
        <a
          className="App-link"
          href="https://github.com/lechiluan"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect me on GitHub
        </a>
      </header>
    </div>
  );
}

export default App;
