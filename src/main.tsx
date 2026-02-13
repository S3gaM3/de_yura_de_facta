import React from 'react'
import ReactDOM from 'react-dom/client'
import { AchievementProvider } from './contexts/AchievementContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AchievementProvider>
      <App />
    </AchievementProvider>
  </React.StrictMode>,
)
