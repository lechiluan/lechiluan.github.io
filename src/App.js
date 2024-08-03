import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogList from "./components/BlogList";
import "./App.css";

function App() {
  const posts = [
    { title: "First Post", content: "This is my first blog post!" },
    { title: "Second Post", content: "This is my second blog post!" },
  ];

  return (
    <div className="App">
      <Header />
      <BlogList posts={posts} />
      <Footer />
    </div>
  );
}

export default App;
