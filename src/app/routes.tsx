// ============================================
// ROUTES - App navigation
// ============================================

import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Diet } from '../pages/Diet';
import { Gym } from '../pages/Gym';
import { Settings } from '../pages/Settings';
import { FoodManager } from '../pages/FoodManager';

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
    {
        path: '/foods',
        element: <FoodManager />,
    },
]);

