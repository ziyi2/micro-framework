import React from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends React.PureComponent {
  handleButtonClick(e) {
    console.log('handleButtonClick', e.target);
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <button onClick={this.handleButtonClick}>Shadow DOM 事件测试</button>
        </header>
      </div>
    );
  }
}

export default App;