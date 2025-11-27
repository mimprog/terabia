import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import store from './store';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <ContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ContextProvider>,
  </Provider>

)
