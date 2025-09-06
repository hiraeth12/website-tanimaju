import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setAlert(null);

    try {
      const success = await login(formData.email, formData.password, formData.remember);

      if (success) {
        setAlert({
          variant: "success",
          title: "Success",
          message: "Login successful! Redirecting...",
        });

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setAlert({
          variant: "error",
          title: "Login Failed",
          message: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
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
              Welcome !
            </h1>
            <p className="text-gray-600 text-sm font-body">
              Sign in to your account to continue !
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8 font-body">
          {alert && (
            <Alert
              variant={alert.variant}
              title={alert.title}
              duration={5000}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  className="h-11 pr-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="remember"
                className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                checked={formData.remember}
                onCheckedChange={(checked) => handleInputChange("remember", checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
