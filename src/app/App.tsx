// src/app/App.tsx
import { RouterProvider } from 'react-router';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
