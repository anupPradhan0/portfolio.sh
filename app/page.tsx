'use client'

import { useState } from 'react'
import IdentityComp from '@/components/IdentityComp'
import TerminalComp from '@/components/TerminalComp'

function App() {
  const [firstCommandExecuted, setFirstCommandExecuted] = useState(false);

  const handleFirstCommand = () => {
    setFirstCommandExecuted(true);
  };

  return (
    <div className="app-shell">
      <div className="main-content-area">
        <div className={`identity-pane border-2 border-green-400 ${firstCommandExecuted ? 'hide-on-mobile' : ''}`}>
          <IdentityComp/>
        </div>
        <div className="terminal-pane">
          <TerminalComp onFirstCommand={handleFirstCommand} />
        </div>
      </div>
    </div>
  )
}

export default App
