import React from 'react'
import TeachingMaterialsEditor from '../components/Editor'
import useUserContext from '../hooks/useUserContext'
import { Navigate } from 'react-router'


const Edit: React.FC = () => {
    const { user } = useUserContext()
  return (


      <main>
          {user ?  <TeachingMaterialsEditor /> :  <Navigate to='/login' />}
      </main>


  )
}

export default Edit