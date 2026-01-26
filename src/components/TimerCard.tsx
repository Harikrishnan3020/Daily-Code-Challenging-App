import { useEffect, useState } from "react";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimerCard = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="glass-card p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Time Elapsed</span>
      </div>

      <div className={`text-3xl md:text-4xl font-mono font-bold text-center py-4 ${isRunning ? "animate-timer-tick text-primary" : "text-foreground"}`}>
        {formatTime(seconds)}
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          onClick={toggleTimer}
          variant="outline"
          size="lg"
          className="flex-1 max-w-[120px] border-primary/30 hover:bg-primary/10 hover:border-primary transition-all"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button
          onClick={resetTimer}
          variant="ghost"
          size="lg"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimerCard;
