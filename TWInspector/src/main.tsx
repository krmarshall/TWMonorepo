import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../../TWPlanner/frontend/src/tailwind.css';
import 'animate.css';
import DOMPurify from 'dompurify';
import App from './App';

DOMPurify.setConfig({ ALLOWED_TAGS: ['p', 'span', 'b'], ALLOWED_ATTR: ['class'] });
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
