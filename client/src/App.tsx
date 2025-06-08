import { useEffect } from 'react';
import './App.css';

interface User {
  userid: number;
  firstname: string;
  lastname: string;
  email: string;
}

function App() {
  useEffect(() => {
    fetch('http://localhost:3001/', {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data: User[]) => {
        console.log('Fetched users:', data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World</h1>
      </header>
    </div>
  );
}

export default App;
