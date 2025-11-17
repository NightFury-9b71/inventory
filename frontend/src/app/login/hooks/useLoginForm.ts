import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useLoginMutation } from "@/services/auth_service";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function useLoginForm(onLoginSuccess?: (data: LoginFormData) => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const loginMutation = useLoginMutation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };
  
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    loginMutation.mutate(formData, {
      onSuccess: () => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[useLoginForm] login success, refreshing user and redirecting');
        }
        toast.success("Welcome back!", {
          description: "You have successfully signed in to your account.",
        });

        refreshUser();

        onLoginSuccess?.(formData);

        // Redirect to callback URL or dashboard
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
      },
      onError: (error: Error) => {
        toast.error("Invalid Credentials", {
          description: "Please check your credentials and try again.",
        });
        console.log(error.message);
      },
    });
  };  const handleForgotPassword = () => {
    toast.info("Password reset link sent!", {
      description: "Check your username for password reset instructions.",
    });
  };

  const handleSignUp = () => {
    toast.info("Redirecting to sign up...");
  };

  const fillDemoCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      username: "admin",
      password: "password",
    }));
    toast.success("Demo credentials filled!");
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    formData,
    showPassword,
    isPending: loginMutation.isPending,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleForgotPassword,
    handleSignUp,
    fillDemoCredentials,
    togglePasswordVisibility,
  };
}
