import { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Game from './Game';
import { skins } from './Util';

function App() {
  const [movement, setMovement] = useState();
  const [keys, setKeys] = useState();
  const [mobs, setMobs] = useState([]);
  const [elapsedTics, setElapsedTics] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  let game = useRef();
  let client = useRef();

  useEffect(() => {
    game.current = new Game(setMovement, setKeys);
    client.current = new Client(setIsConnected, setMobs, setElapsedTics);
  }, []);

  return (
    <>
      <h1>PixiJS + React</h1>

      <pre>{`Movement: ${JSON.stringify(movement)}`}</pre>
      <pre>{`Keys: ${JSON.stringify(keys)}`}</pre>
      <pre>{`Mobs: ${JSON.stringify(mobs)}`}</pre>

      <ul>
        <button onClick={() => game.current.resetPlayerLocation()}>
          Reset Player Location
        </button>
        <button
          onClick={() => {
            if (isConnected) {
              client.current.disconnect();
            } else {
              client.current.connect();
            }
          }}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        <p>
          {isConnected
            ? `Connected; ${elapsedTics} elapsed tics`
            : `Not connected`}
        </p>
      </ul>

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