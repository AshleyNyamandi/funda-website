import React, { useState } from 'react'
import Login from '../components/Login'
import TeachingMaterialsEditor from '../components/Editor'


const Edit: React.FC = () => {
    const [user, setUser] = useState<string>("loggedIn")
  return (

      <main className='min-h-screen flex items-center justify-center'>
          {user === "loggedIn" ? <Login /> :  <TeachingMaterialsEditor />}
      </main>


  )
}

export default Edit