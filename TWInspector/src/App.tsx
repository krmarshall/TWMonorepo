import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AppProvider } from '../../TWPlanner/frontend/src/contexts/AppContext';
import { ElectronProvider } from './contexts/ElectronContext';
import { Suspense } from 'react';
import LoadingSpinner from '../../TWPlanner/frontend/src/components/LoadingSpinner';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import AgentSelect from './pages/AgentSelect';
import About from './pages/About';
import SkillTree from './pages/SkillTree';

const App = () => {
  return (
    <AppProvider>
      <ElectronProvider>
        <div className="bg-gray-800 w-screen h-screen px-8 flex flex-col flex-nowrap pb-2 font-CaslonAntique text-white select-none">
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
            <div className="p-2 flex gap-2">
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>{' '}
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
              <Link to="/agentSelect" className="[&.active]:font-bold">
                Agent Select
              </Link>
            </div>
            <hr />
            <Suspense fallback={<LoadingSpinner loadingText="Loading..." />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/agentSelect" element={<AgentSelect />} />
                <Route path="/skillTree/:mod/:faction/:character" element={<SkillTree />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </ElectronProvider>
    </AppProvider>
  );
};

export default App;
