import React, { useState } from 'react'
import Login from '../components/Login'
import TeachingMaterialsEditor from '../components/Editor'


const Edit: React.FC = () => {
    const [user, setUser] = useState<string>("editor")
  return (

      <main className='min-h-screen flex items-center justify-center'>
          {user === "editor" ? <TeachingMaterialsEditor />: <Login />}
      </main>


  )
}

export default Edit