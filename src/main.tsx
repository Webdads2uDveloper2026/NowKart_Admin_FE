import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { Main_Route } from './routes/main_route/Main_Route.ts'
import store from './store/store/Store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={Main_Route}/>
    </Provider>
    
  </StrictMode>,
)