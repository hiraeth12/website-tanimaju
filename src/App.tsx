import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Order from "./pages/order/Order";
import Blog from "./pages/blog/Blog";
import ProductDetail from "./pages/order/ProductDetail";
import BlogPost from "@/pages/blog/BlogPost";
import NotFound from "@/pages/notfound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/:slug" element={<ProductDetail />} /> 
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;