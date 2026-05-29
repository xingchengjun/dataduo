import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SkillTree from './pages/SkillTree';
import Lesson from './pages/Lesson';
import Result from './pages/Result';

function App() {
  return (
    <HashRouter>
      <div className="max-w-lg mx-auto min-h-screen bg-white shadow-sm relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skill-tree" element={<SkillTree />} />
          <Route path="/lesson/:nodeId" element={<Lesson />} />
          <Route path="/result/:nodeId" element={<Result />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
