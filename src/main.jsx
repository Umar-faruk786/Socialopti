import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AssistantProvider } from './context/AssistantContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AssistantProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AssistantProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
