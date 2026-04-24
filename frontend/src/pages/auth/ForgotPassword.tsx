import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import authService from "@/services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.forgotPassword({ email });
      toast.success("Password reset link sent! Check your email.");
      setIsSent(true);
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || "Failed to send reset email. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {isSent 
              ? "We've sent an email with instructions to reset your password."
              : "Enter your email and we will send you a reset link."
            }
          </CardDescription>
        </CardHeader>
        
        {!isSent ? (
          <form onSubmit={handleForgot}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending link..." : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col gap-4">
             <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Return to login</Link>
             </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
