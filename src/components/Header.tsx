import { Code2, Flame, Trophy } from "lucide-react";

interface HeaderProps {
  streak: number;
  problemsSolved: number;
}

const Header = ({ streak, problemsSolved }: HeaderProps) => {
  return (
    <header className="glass-card px-4 py-3 md:px-6 md:py-4 flex items-center justify-between animate-slide-up">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Code2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold gradient-text">CodeDaily</h1>
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
      </div>
    </header>
  );
};

export default Header;
