import React from 'react'
import FileUpload from './FileUpload'
import TextImageEditing from './TextImageEditing'
import FileUploadFeatures from './components/FileUploadFeatures/FileUploadFeatures'

import "./App.css"

const App = () => {
  return (
    <>
     <FileUpload/>
     <FileUploadFeatures/>
     {/* <TextImageEditing/> */}
    </>
    

  )
}

export default App