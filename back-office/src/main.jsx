import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import { store } from './redux/store';  // <-- Import nommé

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* N'oublie pas le Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
