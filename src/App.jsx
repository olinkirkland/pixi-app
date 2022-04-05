import { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Game from './Game';
import { skins } from './Util';

function App() {
  const [movement, setMovement] = useState();
  const [keys, setKeys] = useState();
  const [elapsedTics, setElapsedTics] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  let game = useRef();
  let client = useRef();

  useEffect(() => {
    game.current = new Game(setMovement, setKeys);
    client.current = new Client(setIsConnected, setElapsedTics, game.current);
  }, []);

  return (
    <>
      <h1>PixiJS + React</h1>

      <pre>{`Movement: ${JSON.stringify(movement)}`}</pre>
      <pre>{`Keys: ${JSON.stringify(keys)}`}</pre>

      <div className="column">
        <div className="panel">
          <p>Server Simulator - Not a real server</p>
          <ul>
            <button
              onClick={() => {
                if (isConnected) {
                  client.current.disconnect();
                } else {
                  client.current.connect();
                }
              }}
            >
              {isConnected ? 'Stop Sim' : 'Start Sim'}
            </button>
            <p>{isConnected ? `Running; ${elapsedTics} elapsed tics` : ``}</p>
          </ul>
        </div>

        <div className="panel">
          <p>Server Simulator - Not a real server</p>
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
        </div>
      </div>
    </>
  );
}

export default App;
