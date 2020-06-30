import React, { useState, useEffect } from 'react';

import './App.css';
import api from './services/api.js'
function App() {
  const [projects, setProjects] = useState([
    'App Development',
    'Web Front-End',
  ]);

  useEffect(() => {
    api.get('repositories').then(response => {console.log(response)});
  }, [])
  /*
* useState retorna um array com 2 posições
 1. Variável com seu valor inicial
 2. Função para atualizar esse valor 
*/
  function handleAddProject() {
    // projects.push( `New Projects ${Date.now()}`);
    setProjects([...projects, `New Projects ${Date.now()}`]);
  }
  return (
    <>
      <header title="Projects">
        <h1>Projects</h1>
      </header>
    
      <ul>
        {projects.map((project) => (
          <li>{project}</li>
        ))}
      </ul>
      <button type="button" onClick={handleAddProject}>
        Add Project
      </button>
    </>
  );
}

export default App;
