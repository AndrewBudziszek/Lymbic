import './App.css';
import SOVA from './components/SOVA/SOVA';
import Eval from './components/SOVA/Eval';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello, Andrew</p>
        <p>Lymbic ADHD Evaluation</p>
        <SOVA/>
        <Eval/>
      </header>
    </div>
  );
}

export default App;
