import { useState } from 'react'
import Login from './Pages/Authh/login.jsx'
import Menu from './component/menu.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return isLoggedIn ? <Menu /> : <Login onLogin={() => setIsLoggedIn(true)} />
}

export default App
