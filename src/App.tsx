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
const Panen = lazy(() => import("@/pages/dashboard/slug_pages/PanenPage/Panen"));
const CreatePanen = lazy(() => import("@/pages/dashboard/slug_pages/PanenPage/CreatePanen"));
const EditPanen = lazy(() => import("@/pages/dashboard/slug_pages/PanenPage/EditPanen"));
const Item = lazy(() => import("@/pages/dashboard/slug_pages/Produk/item"));
const CreateItem = lazy(() => import("@/pages/dashboard/slug_pages/Produk/CreateItem"));
const EditItem = lazy(() => import("@/pages/dashboard/slug_pages/Produk/EditItem"));
const Petani = lazy(() => import("@/pages/dashboard/slug_pages/Petani/Petani"));
const CreatePetani = lazy(() => import("@/pages/dashboard/slug_pages/Petani/CreatePetani"));
const EditPetani = lazy(() => import("@/pages/dashboard/slug_pages/Petani/EditPetani"));
const Bibit = lazy(() => import("@/pages/dashboard/slug_pages/Bibit/Bibit"));
const CreateBibit = lazy(() => import("@/pages/dashboard/slug_pages/Bibit/CreateBibit"));
const EditBibit = lazy(() => import("@/pages/dashboard/slug_pages/Bibit/EditBibit"));
const Tanaman = lazy(() => import("@/pages/dashboard/slug_pages/Tanaman/Tanaman"));
const CreateTanaman = lazy(() => import("@/pages/dashboard/slug_pages/Tanaman/CreateTanaman"));
const EditTanaman = lazy(() => import("@/pages/dashboard/slug_pages/Tanaman/EditTanaman"));
const Posts = lazy(() => import("@/pages/dashboard/slug_pages/Post/Posts"));
const CreatePosts = lazy(() => import("@/pages/dashboard/slug_pages/Post/CreatePosts"));
const EditPosts = lazy(() => import("@/pages/dashboard/slug_pages/Post/EditPosts"));
const Login = lazy(() => import("@/pages/Login"));
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
          <Route path="/admin/panen/edit/:id" element={<EditPanen />} />
          <Route path="/admin/item" element={<Item />} />
          <Route path="/admin/item/create" element={<CreateItem />} />
          <Route path="/admin/item/edit/:id" element={<EditItem />} />
          <Route path="/admin/petani" element={<Petani />} />
          <Route path="/admin/petani/create" element={<CreatePetani />} />
          <Route path="/admin/petani/edit/:id" element={<EditPetani />} />
          <Route path="/admin/bibit" element={<Bibit />} />
          <Route path="/admin/bibit/create" element={<CreateBibit />} />
          <Route path="/admin/bibit/edit/:id" element={<EditBibit />} />
          <Route path="/admin/tanaman" element={<Tanaman />} />
          <Route path="/admin/tanaman/create" element={<CreateTanaman />} />
          <Route path="/admin/tanaman/edit/:id" element={<EditTanaman />} />
          <Route path="/admin/posts" element={<Posts />} />
          <Route path="/admin/posts/create" element={<CreatePosts />} />
          <Route path="/admin/posts/edit/:id" element={<EditPosts />} />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
