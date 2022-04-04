import { useEffect, useState } from 'react';
import Game from './Game';

function App() {
  const [speed, setSpeed] = useState({ vertical: 0, horizontal: 0 });
  const [keys, setKeys] = useState({});

  useEffect(() => {
    new Game(setSpeed, setKeys);
  }, []);

  return (
    <>
      <h1>PixiJS + React</h1>
      <p>{JSON.stringify(speed)}</p>
      <p>{JSON.stringify(keys)}</p>
    </>
  );
}

export default App;
