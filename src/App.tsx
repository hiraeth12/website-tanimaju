import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingScreen } from "@/components/LoadingSpinner";

// Lazy load all the page components
const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));
const Order = lazy(() => import("./pages/order/Order"));
const ProductDetail = lazy(() => import("./pages/order/ProductDetail"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const BlogPost = lazy(() => import("@/pages/blog/BlogPost"));
const NotFound = lazy(() => import("@/pages/notfound"));
const Admin = lazy(() => import("@/pages/dashboard/Admin"));
const Panen = lazy(
  () => import("@/pages/dashboard/slug_pages/PanenPage/Panen")
);
const CreatePanen = lazy(
  () => import("@/pages/dashboard/slug_pages/PanenPage/CreatePanen")
);
const EditPanen = lazy(
  () => import("@/pages/dashboard/slug_pages/PanenPage/EditPanen")
);
const Item = lazy(() => import("@/pages/dashboard/slug_pages/Produk/item"));
const CreateItem = lazy(
  () => import("@/pages/dashboard/slug_pages/Produk/CreateItem")
);
const EditItem = lazy(
  () => import("@/pages/dashboard/slug_pages/Produk/EditItem")
);
const Petani = lazy(() => import("@/pages/dashboard/slug_pages/Petani/Petani"));
const CreatePetani = lazy(
  () => import("@/pages/dashboard/slug_pages/Petani/CreatePetani")
);
const EditPetani = lazy(
  () => import("@/pages/dashboard/slug_pages/Petani/EditPetani")
);
const Bibit = lazy(() => import("@/pages/dashboard/slug_pages/Bibit/Bibit"));
const CreateBibit = lazy(
  () => import("@/pages/dashboard/slug_pages/Bibit/CreateBibit")
);
const EditBibit = lazy(
  () => import("@/pages/dashboard/slug_pages/Bibit/EditBibit")
);
const Tanaman = lazy(
  () => import("@/pages/dashboard/slug_pages/Tanaman/Tanaman")
);
const CreateTanaman = lazy(
  () => import("@/pages/dashboard/slug_pages/Tanaman/CreateTanaman")
);
const EditTanaman = lazy(
  () => import("@/pages/dashboard/slug_pages/Tanaman/EditTanaman")
);
const Posts = lazy(() => import("@/pages/dashboard/slug_pages/Post/Posts"));
const CreatePosts = lazy(
  () => import("@/pages/dashboard/slug_pages/Post/CreatePosts")
);
const EditPosts = lazy(
  () => import("@/pages/dashboard/slug_pages/Post/EditPosts")
);
const Login = lazy(() => import("@/pages/Login"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/panen"
            element={
              <ProtectedRoute>
                <Panen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/panen/create"
            element={
              <ProtectedRoute>
                <CreatePanen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/panen/edit/:id"
            element={
              <ProtectedRoute>
                <EditPanen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/item"
            element={
              <ProtectedRoute>
                <Item />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/item/create"
            element={
              <ProtectedRoute>
                <CreateItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/item/edit/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/petani"
            element={
              <ProtectedRoute>
                <Petani />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/petani/create"
            element={
              <ProtectedRoute>
                <CreatePetani />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/petani/edit/:id"
            element={
              <ProtectedRoute>
                <EditPetani />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bibit"
            element={
              <ProtectedRoute>
                <Bibit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bibit/create"
            element={
              <ProtectedRoute>
                <CreateBibit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bibit/edit/:id"
            element={
              <ProtectedRoute>
                <EditBibit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tanaman"
            element={
              <ProtectedRoute>
                <Tanaman />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tanaman/create"
            element={
              <ProtectedRoute>
                <CreateTanaman />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tanaman/edit/:id"
            element={
              <ProtectedRoute>
                <EditTanaman />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/create"
            element={
              <ProtectedRoute>
                <CreatePosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/edit/:id"
            element={
              <ProtectedRoute>
                <EditPosts />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
