import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/Alert";

interface RegisterForm {
  namaLengkap: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterForm>({
    namaLengkap: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaLengkap || !formData.email || !formData.password) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Please fill in all required fields",
      });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    setAlert(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.namaLengkap,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setAlert({
          variant: "success",
          title: "Success",
          message:
            "Registration successful! Please wait for admin approval. Redirecting to login...",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setAlert({
          variant: "error",
          title: "Registration Failed",
          message: errorData.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="space-y-6 pb-8 pt-8">
          {/* Company Logo */}
          <div className="flex justify-center">
            <img src="/images/tnmj.png" alt="Logo" className="w-20 h-auto" />
          </div>

          {/* Header Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 font-cascadia">
              Buat Akun
            </h1>
            <p className="text-gray-600 text-sm font-body">
              Daftar untuk akun baru
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8 font-body">
          {alert && (
            <Alert
              variant={alert.variant}
              title={alert.title}
              duration={alert.variant === "success" ? 10000 : 5000}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama Lengkap Input */}
            <div className="space-y-2">
              <Label
                htmlFor="namaLengkap"
                className="text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </Label>
              <Input
                id="namaLengkap"
                type="text"
                placeholder="Masukkan nama username Anda"
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={formData.namaLengkap}
                onChange={(e) =>
                  handleInputChange("namaLengkap", e.target.value)
                }
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Alamat Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  className="h-11 pr-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Back to Login Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Sudah punya akun? Masuk
            </Button>
          </div>

          {/* Back to Home Button */}
          <div>
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200"
              onClick={() => navigate("/")}
            >
              Kembali ke Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
