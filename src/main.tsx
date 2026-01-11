import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import EditorProvider from './context/EditorContext.tsx'
import UserContextProvider from './context/UserContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <UserContextProvider>
        <EditorProvider>
          <App />
        </EditorProvider>
      </UserContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
