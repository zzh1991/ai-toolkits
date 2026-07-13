// src/app/router.tsx
import { createBrowserRouter } from 'react-router';
import AnimatedLayout from './AnimatedLayout';
import LandingPage from '@/routes/landing';
import ReminderPage from '@/routes/reminder';
import KanbanPage from '@/routes/kanban';
import ParkingPage from '@/routes/parking';
import GoldPage from '@/routes/gold';
import VocabPage from '@/routes/vocab';

export const router = createBrowserRouter([
  {
    element: <AnimatedLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/reminder',
        element: <ReminderPage />,
      },
      {
        path: '/kanban',
        element: <KanbanPage />,
      },
      {
        path: '/parking',
        element: <ParkingPage />,
      },
      {
        path: '/gold',
        element: <GoldPage />,
      },
      {
        path: '/vocab',
        element: <VocabPage />,
      },
    ],
  },
]);
