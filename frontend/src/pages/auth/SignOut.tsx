import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/services/authService";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await authService.logout();
        toast.info("You have been signed out");
      } catch (error) {
        console.error("Logout error", error);
      } finally {
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Signing out...</h2>
      </div>
    </div>
  );
};

export default SignOut;
