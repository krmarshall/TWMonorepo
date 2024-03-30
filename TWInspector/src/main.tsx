import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../../TWPlanner/frontend/src/tailwind.css';
import 'animate.css';
import DOMPurify from 'dompurify';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
// Create a new router instance
const router = createRouter({ routeTree });
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

DOMPurify.setConfig({ ALLOWED_TAGS: ['p', 'span', 'b'], ALLOWED_ATTR: ['class'] });
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
