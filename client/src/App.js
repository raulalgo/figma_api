import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    images: [
      {
        name: '',
        url: ''
      }
    ]
  }

  componentDidMount() {
    fetch('/frames')
      .then(res => res.json())
      .then(data => this.setState({ images: data}))
      .catch(error => console.log(error));
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
      {this.state.images.map(
        (frame, i) => 
        <div key={i} >
          <img src={frame.url} alt={"figma component"} />
        </div>
      )}
      </div>
    );
  }
}

export default App;
