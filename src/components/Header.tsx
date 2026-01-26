import { Code2, Flame, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  streak: number;
  problemsSolved: number;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
}

/**
 * Header Component
 * Displays application logo, user streak, and solved count.
 * Also handles user avatar display if logged in.
 */
const Header = ({ streak, problemsSolved }: HeaderProps) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("hackathon-habit-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  return (
    <header className="glass-card px-4 py-3 md:px-6 md:py-4 flex items-center justify-between animate-slide-up">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Code2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold gradient-text">Hackathon Habit</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Master one problem at a time</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-warning/10 border border-warning/20">
          <Flame className="w-4 h-4 md:w-5 md:h-5 text-warning animate-glow-pulse" />
          <div className="text-right">
            <p className="text-sm md:text-base font-bold text-warning">{streak}</p>
            <p className="text-[10px] md:text-xs text-warning/70 hidden sm:block">day streak</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-success/10 border border-success/20">
          <Trophy className="w-4 h-4 md:w-5 md:h-5 text-success" />
          <div className="text-right">
            <p className="text-sm md:text-base font-bold text-success">{problemsSolved}</p>
            <p className="text-[10px] md:text-xs text-success/70 hidden sm:block">solved</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary/10 border border-primary/20">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-foreground">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{user.provider || 'Account'}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
