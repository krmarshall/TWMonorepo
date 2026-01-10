import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './tailwind.css';
import DOMPurify from 'dompurify';

DOMPurify.setConfig({ ALLOWED_TAGS: ['p', 'span', 'b'], ALLOWED_ATTR: ['class'] });
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
