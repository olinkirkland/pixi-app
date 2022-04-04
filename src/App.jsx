import { useEffect } from 'react';
import Game from './Game';

function App() {
  useEffect(() => {
    new Game();
  }, []);

  return <h1>PixiJS + React</h1>;
}

export default App;
