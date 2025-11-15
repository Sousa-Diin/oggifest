import './App.css'
import 'notie/dist/notie.css'
import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'

import { SideBar } from './components/siderBar/SideBar'
import OggiFest from './pages/oggicar/OggiFest'
import Agendamentos from './pages/Agendamentos'
import AccessDenied from './pages/auth/AccessDenied'
import LoadSplash from './pages/splash/LoadSplash'

// Chave secreta AES
const SECRET_KEY = "SEU_APP_SUPER_SECRETO_123"; // <<< altere depois para algo mais forte

// Funções auxiliares AES
const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return null
  }
}

function App() {

  const savedEncryptedPage = localStorage.getItem('activeComponent')
  const savedDecryptedPage = savedEncryptedPage ? decrypt(savedEncryptedPage) : null

  const [activeComponent, setActiveComponent] = useState(savedDecryptedPage || 'oggifest')

  const handleSetActiveComponent = (page) => {
    const encryptedPage = encrypt(page)
    localStorage.setItem('activeComponent', encryptedPage)
    setActiveComponent(page)
  }

  useEffect(() => {
    if (!activeComponent) {
      handleSetActiveComponent('oggifest')
    }
  }, [activeComponent])

  const stackComponent = {
    oggifest: <OggiFest />,
    load: <LoadSplash />,
    appointments: <Agendamentos setActiveComponent={handleSetActiveComponent} />,
    accessdenied: <AccessDenied admins={[
      "administrador@sistema.com",
      "oggisorvetestrespontas@gmail.com"
    ]}
    onBackToHome={handleSetActiveComponent}
    />,
  }

  return (
    <section className="flex flex-row justify-between w-[98dvw] gap-1 h-[99dvh] capitalize">
      <SideBar setActiveComponent={handleSetActiveComponent} />
      <div className="md:ml-8 w-full">
        {stackComponent[activeComponent] || <OggiFest /> }
      </div>
    </section>
  )
}

export default App
