import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const AppAny = App as any;

createRoot(document.getElementById('root')!).render(
  <AppAny />
)
