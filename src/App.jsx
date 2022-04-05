import { useEffect, useRef, useState } from 'react';
import Game from './Game';

function App() {
  const [movement, setMovement] = useState();
  const [keys, setKeys] = useState();

  const skins = ['blue', 'green', 'orange', 'purple', 'tan'];
  let game = useRef();

  useEffect(() => {
    game.current = new Game(setMovement, setKeys);
  }, []);

  return (
    <>
      <h1>PixiJS + React</h1>
      <pre>{`Movement: ${JSON.stringify(movement)}`}</pre>
      <pre>{`Keys: ${JSON.stringify(keys)}`}</pre>
      <button onClick={() => game.current.resetPlayerLocation()}>
        Reset Player Location
      </button>
      <ul>
        {skins.map((skin) => (
          <li key={skin}>
            <button
              onClick={() => {
                game.current.setSkin(-1, skin);
              }}
            >
              {skin}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
