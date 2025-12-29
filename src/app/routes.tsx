// ============================================
// ROUTES - App navigation
// ============================================

import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Diet } from '../pages/Diet';
import { Gym } from '../pages/Gym';
import { Settings } from '../pages/Settings';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/diet',
        element: <Diet />,
    },
    {
        path: '/gym',
        element: <Gym />,
    },
    {
        path: '/settings',
        element: <Settings />,
    },
]);
