import { useEffect, useRef, useState } from 'react';
import GameController from './controllers/GameController';

function App() {
  const [info, setInfo] = useState({ loading: 'Initializing' });

  let game = useRef();

  useEffect(() => {
    if (!game.current) {
      game.current = new GameController(setInfo);
    }
  }, []);

  return (
    <div className="main">
      <h1>PixiJS + React</h1>

      <div className="column">
        {Object.keys(info).length > 0 && (
          <div className="panel">
            <ul className="info">
              {Object.keys(info).map((key, index) => {
                return (
                  <li key={index}>
                    <p>{key}</p>
                    <pre>{JSON.stringify(Object.values(info)[index])}</pre>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {!info.loading && (
          <div className="panel">
            <h2>Load Map</h2>
            <ul className="flex">
              {game.current.mapController.mapNames.map((mapName) => (
                <li key={mapName}>
                  <button
                    onClick={() => {
                      game.current.mapController.load(mapName);
                    }}
                  >
                    {mapName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="game-container"></div>
      </div>
    </div>
  );
}

export default App;
