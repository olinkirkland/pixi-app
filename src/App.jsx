import { useEffect, useRef, useState } from 'react';
import Game from './Game';

function App() {
  const [info, setInfo] = useState({ loading: true });

  let game = useRef();

  useEffect(() => {
    if (!game.current) {
      game.current = new Game(setInfo);
    }
  }, []);

  return (
    <div className="main">
      <h1>PixiJS + React</h1>

      <div>
        {!info.loading && (
          <>
            <div className="column">
              <div className="panel">
                <h2>Game Info</h2>
                <ul>
                  {Object.keys(info).map((key, index) => {
                    return (
                      <li key={index} className="li-info">
                        <p>{key}</p>
                        <pre>{JSON.stringify(Object.values(info)[index])}</pre>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="panel">
                <h2>Load Map</h2>
                <ul>
                  {game.current.mapController.mapNames.map((mapName) => (
                    <li key={mapName}>
                      <button>{mapName}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        <div className={`game-container ${info.loading ? 'hidden' : ''}`}></div>
      </div>
    </div>
  );
}

export default App;
