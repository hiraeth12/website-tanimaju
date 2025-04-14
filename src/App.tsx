import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Order from './pages/Order';
import Blog from './pages/Blog';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/order" element={<Order />} />
        <Route path="/blog" element={<Blog />} />

      </Routes>
    </Router>
  );
}

export default App;
