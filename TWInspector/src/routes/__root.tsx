import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { AppProvider } from '../../TotalWarhammerPlanner/frontend/src/contexts/AppContext';
import React, { Suspense } from 'react';
import { ElectronProvider } from '../contexts/ElectronContext';
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const Route = createRootRoute({
  component: () => (
    <AppProvider>
      <ElectronProvider>
        <div className="bg-black h-screen w-screen text-white overflow-x-auto">
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <Link to="/treeSelect" className="[&.active]:font-bold">
              Tree Select
            </Link>
          </div>
          <hr />
          <Outlet />
          <Suspense>
            <TanStackRouterDevtools initialIsOpen={false} position="bottom-right" />
          </Suspense>
        </div>
      </ElectronProvider>
    </AppProvider>
  ),
});
