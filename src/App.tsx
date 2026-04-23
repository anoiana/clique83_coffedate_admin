import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/dashboard';
import { UsersListPage } from './pages/user-list';
import { UserDetailPage } from './pages/user-detail';
import { MatchingListPage, MatchingDetailPage } from './pages/matching';
import { UnmatchedPage } from './pages/unmatched';
import { ManualMatchPage } from './pages/manual-match';
import { DemographicsPage } from './pages/demographics';
import { UserJourneyPage } from './pages/user-journey';
import { PendingProfilesPage } from './pages/pending-profiles';
import { MeetingsPage } from './pages/meetings';
import { LocationsPage } from './pages/locations';
import { LoginPage } from './pages/login';
import { LoadingProvider } from './shared/context/LoadingContext';
import { NotificationProvider } from './shared/context/NotificationContext';
import './index.css';

const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersListPage />,
      },
      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },
      {
        path: 'matching',
        element: <MatchingListPage />,
      },
      {
        path: 'matching/:id',
        element: <MatchingDetailPage />,
      },
      {
        path: 'unmatched',
        element: <UnmatchedPage />,
      },
      {
        path: 'manual-match',
        element: <ManualMatchPage />,
      },
      {
        path: 'pending-profiles',
        element: <PendingProfilesPage />,
      },
      {
        path: 'demographics',
        element: <DemographicsPage />,
      },
      {
        path: 'user-journey',
        element: <UserJourneyPage />,
      },
      {
        path: 'meetings',
        element: <MeetingsPage />,
      },
      {
        path: 'locations',
        element: <LocationsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  }
]);

function App() {
  return (
    <LoadingProvider>
      <NotificationProvider>
        <RouterProvider router={appRouter} />
      </NotificationProvider>
    </LoadingProvider>
  );
}

export default App;
