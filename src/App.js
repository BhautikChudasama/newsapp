import React, { Component } from 'react';
import Header from "./header/header";
import News from "./news/news"
import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <News />
      </div>
    );
  }
}

export default App;
