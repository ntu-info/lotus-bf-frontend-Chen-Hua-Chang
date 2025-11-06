// src/main.jsx (修改後的版本)

import React from 'react'
import { createRoot } from 'react-dom/client'
// *** 1. 匯入 BrowserRouter ***
import { BrowserRouter } from 'react-router-dom' 
import App from './App.jsx'
import './index.css' 

// ErrorBoundary 函式 (保持不變)
function ErrorBoundary({ children }) {
  const [err, setErr] = React.useState(null)
  React.useEffect(() => {
    const handler = (e) => setErr(e?.error || e?.reason || e)
    window.addEventListener('error', handler)
    window.addEventListener('unhandledrejection', handler)
    return () => {
      window.removeEventListener('error', handler)
      window.removeEventListener('unhandledrejection', handler)
    }
  }, [])
  if (err) {
    return (
      <div style={{padding:16, fontFamily: 'ui-sans-serif'}}>
        <h2>Runtime error!</h2>
        <pre style={{whiteSpace:'pre-wrap', background:'#f5f5f5', padding:12, borderRadius:8}}>
{String(err?.stack || err?.message || err)}
        </pre>
      </div>
    )
  }
  return children
}

console.log('[main] booting...')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* *** 2. 用 BrowserRouter 把 App 包起來 *** */}
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)