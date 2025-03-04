import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css'; // Custom toast styles
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import DotBackground from './components/DotBackground';
import './App.css';

function App() {
  return (
    <Router>
      <DotBackground />
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        className="toast-container"
        toastClassName="toast-item"
      />
    </Router>
  );
}

export default App;
