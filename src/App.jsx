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
    if (game) game.current = new Game(setMovement, setKeys);
    client.current = new Client(
      setIsConnected,
      setElapsedTics,
      game.current,
      logAction
    );
  }, []);

  function logAction(action) {
    // if (action.action === 'join') console.log(JSON.stringify(action));
    // console.log(action.id, ' ==> ', action.action);
  }

  return (
    <>
      <h1>PixiJS + React</h1>

      <pre>{`Movement: ${JSON.stringify(movement)}`}</pre>
      <pre>{`Keys: ${JSON.stringify(keys)}`}</pre>

      <div className="column">
        <div className="panel">
          <h2>Game</h2>
          <ul>
            <button onClick={() => game.current.jumpToRandomTile()}>
              Jump to random tile
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
              {isConnected ? 'Stop' : 'Start'}
            </button>
          </ul>
        </div>

        <div className="panel">
          <h2>Change your avatar</h2>
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
