import { useState } from "react";
import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  onSubmit: () => Promise<boolean>;
  disabled?: boolean;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const SubmitButton = ({ onSubmit, disabled }: SubmitButtonProps) => {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const success = await onSubmit();
      setStatus(success ? "success" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const buttonConfig = {
    idle: {
      icon: Send,
      text: "Submit Solution",
      className: "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary",
    },
    loading: {
      icon: Loader2,
      text: "Running Tests...",
      className: "bg-primary/80 text-primary-foreground cursor-wait",
    },
    success: {
      icon: CheckCircle2,
      text: "All Tests Passed!",
      className: "bg-success hover:bg-success/90 text-success-foreground glow-success animate-success-bounce",
    },
    error: {
      icon: XCircle,
      text: "Tests Failed",
      className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    },
  };

  const config = buttonConfig[status];
  const Icon = config.icon;

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <Button
        onClick={handleSubmit}
        disabled={disabled || status === "loading"}
        size="lg"
        className={`w-full py-6 text-base font-semibold transition-all duration-300 ${config.className}`}
      >
        <Icon className={`w-5 h-5 mr-2 ${status === "loading" ? "animate-spin" : ""}`} />
        {config.text}
      </Button>

      {status === "success" && (
        <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/30 text-center animate-fade-in">
          <p className="text-success font-medium">🎉 Great job! You've completed today's challenge!</p>
          <p className="text-success/70 text-sm mt-1">Your streak has been updated</p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center animate-fade-in">
          <p className="text-destructive font-medium">Some test cases failed</p>
          <p className="text-destructive/70 text-sm mt-1">Check your solution and try again</p>
        </div>
      )}
    </div>
  );
};

export default SubmitButton;
