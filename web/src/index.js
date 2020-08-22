import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import Search from "./components/search";
import Header from "./components/header";

ReactDOM.render(
  <React.StrictMode>
      <Header />
      <section>
          <div className="container text-center">
              <h1>gDHT</h1>
              <p className="subtitle">
                  A distributed torrent search engine
              </p>
          </div>
      </section>
      <section>
        <Search />
      </section>
  </React.StrictMode>,
  document.getElementById('root')
);

