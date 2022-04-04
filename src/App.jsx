import { useEffect, useState } from 'react';
import Game from './Game';

function App() {
  const [movement, setMovement] = useState();
  const [keys, setKeys] = useState();

  useEffect(() => {
    new Game(setMovement, setKeys);
  }, []);

  return (
    <>
      <h1>PixiJS + React</h1>
      <pre>{JSON.stringify(movement)}</pre>
      <pre>{JSON.stringify(keys)}</pre>
    </>
  );
}

export default App;
