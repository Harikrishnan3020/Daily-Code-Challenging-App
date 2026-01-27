import { Code2, Flame, Trophy, User as UserIcon, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  /** Current streak count in days */
  streak: number;
  /** Total number of problems solved */
  problemsSolved: number;
}

/**
 * Header Component
 * Displays application logo, user streak, and solved count.
 * Also handles user avatar display if logged in.
 */
const Header = ({ streak, problemsSolved }: HeaderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

  /**
   * Clears authentication state and redirects to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("hackathon-habit-auth");
    // Optionally remove user data if you don't want to persist it across logins
    // localStorage.removeItem("hackathon-habit-user"); 
    navigate("/login");
  };

  return (
    <header className="glass-card px-4 py-3 md:px-6 md:py-4 flex items-center justify-between animate-slide-up">
      {/* Brand / Logo Section */}
      <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Code2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold gradient-text">Hackathon Habit</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Master one problem at a time</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Streak Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-warning/10 border border-warning/20">
          <Flame className="w-4 h-4 md:w-5 md:h-5 text-warning animate-glow-pulse" />
          <div className="text-right">
            <p className="text-sm md:text-base font-bold text-warning">{streak}</p>
            <p className="text-[10px] md:text-xs text-warning/70 hidden sm:block">day streak</p>
          </div>
        </div>

        {/* Problems Solved Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-success/10 border border-success/20">
          <Trophy className="w-4 h-4 md:w-5 md:h-5 text-success" />
          <div className="text-right">
            <p className="text-sm md:text-base font-bold text-success">{problemsSolved}</p>
            <p className="text-[10px] md:text-xs text-success/70 hidden sm:block">solved</p>
          </div>
        </div>

        {/* User Profile / Login */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors outline-none focus:ring-2 focus:ring-primary/50">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-medium text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.provider || 'Account'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-white/10 bg-black/90 text-slate-200">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white" onClick={() => navigate("/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-red-500/20 text-red-400 focus:text-red-400" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-colors shadow-lg shadow-primary/20"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
