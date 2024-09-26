import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import ProblemDescription from './pages/Description/ProblemDescription';
import ProblemList from './pages/ProblemList/ProblemList';

function App() {
  return (
    <div className='overflow-hidden'>
      <Navbar />
      <SideBar />
      <Routes>
      <Route path='/'  element={<ProblemList />} />
        <Route path='/problems/list'  element={<ProblemList />} />
        <Route path='/problem/:id' element={ <ProblemDescription />} />
      </Routes>
    </div>
  );
}

export default App;
