import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './index.css'
import Home from './components/Home.jsx'
import EditorPage from './components/EditorPage.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children:[
      {
        path: '',
        element: <Home/>
      },
      {
        path:'/editor/:roomId',
        element:<EditorPage/>
      },
    ]

  }
])

createRoot(document.getElementById('root')).render(

        <RouterProvider router={router}/>

)
