import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { AppProvider } from './contexts/AppContext';
import useBulkMediaQueries from './hooks/useBulkMediaQueries';

const Home = lazy(() => import('./pages/Home'));
const Planner = lazy(() => import('./pages/Planner'));
const TechHome = lazy(() => import('./pages/TechHome'));
const Tech = lazy(() => import('./pages/Tech'));
const About = lazy(() => import('./pages/About'));
const Issues = lazy(() => import('./pages/Issues'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  const { isMobileWidth } = useBulkMediaQueries();
  const xPadding = isMobileWidth ? ' px-2' : ' px-8';
  return (
    <AppProvider>
      <div
        className={
          'bg-gray-800 w-screen h-screen flex flex-col flex-nowrap pb-2 font-CaslonAntique select-none' + xPadding
        }
      >
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#4b5563',
              color: '#e5e7eb',
              fontSize: 'x-large',
              userSelect: 'none',
              border: '1px solid rgb(107 114 128)',
            },
          }}
        />
        <BrowserRouter>
          <Header />
          <Suspense fallback={<LoadingSpinner loadingText="Loading..." />}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/planner/:mod/:faction/:character/:code" element={<Planner />} />
              <Route path="/planner/:mod/:faction/:character" element={<Planner />} />

              <Route path="/techHome" element={<TechHome />} />
              <Route path="/tech/:mod/:techTree" element={<Tech />} />

              <Route path="/about" element={<About />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/404" element={<NotFound />} />

              <Route path="/:mod/:faction" element={<Home />} />

              {/* Fallback Route */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
};

export default App;
