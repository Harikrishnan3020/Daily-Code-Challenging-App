import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Crown, Medal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import RankBadge from "@/components/RankBadge";
import { User as UserType } from "@/types";

/**
 * Leaderboard Page
 * Displays global rankings of all users based on accumulated XP.
 * Highlights the current logged-in user.
 */
const Leaderboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserType[]>([]);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    useEffect(() => {
        // Load all users
        const allUsers = JSON.parse(localStorage.getItem("hackathon-habit-all-users") || "[]");

        // Sort by XP descending
        const sortedUsers = allUsers.sort((a: UserType, b: UserType) => (b.xp || 0) - (a.xp || 0));
        setUsers(sortedUsers);

        // Get current user to highlight
        const savedUser = localStorage.getItem("hackathon-habit-user");
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-yellow-400" fill="currentColor" />;
            case 1: return <Medal className="w-6 h-6 text-slate-300" fill="currentColor" />;
            case 2: return <Medal className="w-6 h-6 text-orange-400" fill="currentColor" />;
            default: return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-white" onClick={() => navigate("/")}>
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </div>

                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4 animate-float">
                        <Trophy className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent">
                        Global Leaderboard
                    </h1>
                    <p className="text-muted-foreground text-lg">See who's leading the race to mastery</p>
                </div>

                {/* Leaderboard Table */}
                <div className="glass-card overflow-hidden animate-slide-up">
                    <div className="p-4 md:p-6 bg-white/5 border-b border-white/10 grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                        <div className="col-span-7 md:col-span-6">Coder</div>
                        <div className="col-span-3 md:col-span-3 text-right">XP</div>
                        <div className="hidden md:block md:col-span-2 text-right">League</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {users.length > 0 ? (
                            users.map((user, index) => {
                                const isCurrentUser = currentUser?.id === user.id;
                                return (
                                    <div
                                        key={user.id}
                                        className={`
                                            grid grid-cols-12 gap-4 items-center p-4 md:p-6 transition-colors
                                            ${isCurrentUser ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5'}
                                        `}
                                    >
                                        <div className="col-span-2 md:col-span-1 flex justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                        <div className="col-span-7 md:col-span-6 flex items-center gap-3 md:gap-4 overflow-hidden">
                                            <div className="relative shrink-0">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {index < 3 && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-slate-900 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-semibold truncate ${isCurrentUser ? 'text-primary' : 'text-white'}`}>
                                                    {user.name} {isCurrentUser && "(You)"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                                    Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-span-3 md:col-span-3 text-right">
                                            <span className="font-mono font-bold text-lg md:text-xl text-white">
                                                {user.xp?.toLocaleString() || 0}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-1">XP</span>
                                        </div>
                                        <div className="hidden md:block md:col-span-2 text-right">
                                            <div className="flex justify-end">
                                                <RankBadge xp={user.xp || 0} size="sm" showLabel={false} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>No active coders yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
