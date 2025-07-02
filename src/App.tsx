import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy load all the page components
const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));
const Order = lazy(() => import("./pages/order/Order"));
const ProductDetail = lazy(() => import("./pages/order/ProductDetail"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const BlogPost = lazy(() => import("@/pages/blog/BlogPost"));
const NotFound = lazy(() => import("@/pages/notfound"));
const Admin = lazy(() => import("@/pages/dashboard/Admin"));
const Panen = lazy(() => import("@/pages/dashboard/slug_pages/panen/Panen"));
const CreatePanen = lazy(() => import("@/pages/dashboard/slug_pages/panen/CreatePanen"));
const Item = lazy(() => import("@/pages/dashboard/slug_pages/Petani/item"));

// You can create a more sophisticated loading component if you like
const LoadingSpinner = () => <div>Loading...</div>;

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/panen" element={<Panen />} />
          <Route path="/admin/panen/create" element={<CreatePanen />} />
          <Route path="/admin/item" element={<Item />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
