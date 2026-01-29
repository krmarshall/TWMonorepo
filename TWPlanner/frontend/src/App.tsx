import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { AppProvider } from './contexts/AppContext.tsx';

const Home = lazy(() => import('./pages/Home.tsx'));
const Planner = lazy(() => import('./pages/Planner.tsx'));
const TechHome = lazy(() => import('./pages/TechHome.tsx'));
const Tech = lazy(() => import('./pages/Tech.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

const App = () => {
  return (
    <AppProvider>
      <div className={'bg-gray-800 w-screen h-screen flex flex-col flex-nowrap font-[CaslonAntique] select-none'}>
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
              <Route path="/issues" element={<About />} />
              <Route path="/404" element={<NotFound />} />

              <Route path="/:mod/:faction" element={<Home />} />

              {/* Fallback Route */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <div className="w-full min-h-24 bg-gray-900 flex flex-row flex-nowrap place-content-around">
          <div className="w-[728px] h-[90px] my-auto border border-gray-400"></div>
          <div className="w-[728px] h-[90px] my-auto border border-gray-400"></div>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
