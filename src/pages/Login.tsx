import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Mail, Lock, Github, Chrome, Sparkles, Zap, Trophy } from "lucide-react";
import { toast } from "sonner";
import AccountSelector from "@/components/AccountSelector";

import { User as Account } from "@/types";

declare global {
    interface Window {
        google: any;
    }
}

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<"Google" | "GitHub">("Google");

    // Load saved credentials on mount
    useEffect(() => {
        // Check for active session
        const authToken = localStorage.getItem("hackathon-habit-auth");
        if (authToken) {
            navigate("/");
            return;
        }

        const savedEmail = localStorage.getItem("hackathon-habit-email");
        const savedRemember = localStorage.getItem("hackathon-habit-remember") === "true";

        if (savedRemember && savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, [navigate]);

    const handleGoogleCallback = async (response: any) => {
        setIsLoading(true);
        try {
            const res = await fetch("/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: response.credential
                })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("hackathon-habit-auth", response.credential);
                localStorage.setItem("hackathon-habit-user", JSON.stringify({
                    id: data.email,
                    email: data.email,
                    name: data.name,
                    avatar: data.picture || "",
                    provider: "Google"
                }));

                toast.success("Google login successful!", {
                    description: `Welcome, ${data.name}!`
                });
                navigate("/");
            } else {
                toast.error("Google login failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login Error", { description: "Failed to connect to server" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initGoogle = () => {
            if (window.google && document.getElementById("googleSignInButton")) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
                        callback: handleGoogleCallback
                    });
                    window.google.accounts.id.renderButton(
                        document.getElementById("googleSignInButton"),
                        { theme: "outline", size: "large", width: "100%" }
                    );
                } catch (e) {
                    console.error("Google Auth Init Failed", e);
                }
                return true;
            }
            return false;
        };

        const timer = setInterval(() => {
            if (initGoogle()) clearInterval(timer);
        }, 500);

        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login (replace with real auth later)
        setTimeout(() => {
            if (email && password) {
                // Save credentials if remember me is checked
                if (rememberMe) {
                    localStorage.setItem("hackathon-habit-email", email);
                    localStorage.setItem("hackathon-habit-remember", "true");
                } else {
                    localStorage.removeItem("hackathon-habit-email");
                    localStorage.removeItem("hackathon-habit-remember");
                }

                // Save auth token (simulated)
                localStorage.setItem("hackathon-habit-auth", "demo-token");

                // Save mock user for Header display
                localStorage.setItem("hackathon-habit-user", JSON.stringify({
                    id: "demo-user",
                    email: email,
                    name: email.split("@")[0],
                    avatar: "",
                    provider: "Email"
                }));

                toast.success("Welcome back!", { description: "Let's build that coding habit!" });
                navigate("/");
            } else {
                toast.error("Invalid credentials", { description: "Please check your email and password" });
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSocialLogin = (provider: "Google" | "GitHub") => {
        setSelectedProvider(provider);
        setShowAccountSelector(true);
    };

    const handleAccountSelect = (account: Account) => {
        setIsLoading(true);

        toast.info(`Signing in as ${account.name}...`, {
            description: "Authenticating with " + account.provider
        });

        setTimeout(() => {
            // Save auth token and user info
            localStorage.setItem("hackathon-habit-auth", "social-demo-token");
            localStorage.setItem("hackathon-habit-user", JSON.stringify(account));

            toast.success(`${account.provider} login successful!`, {
                description: `Welcome, ${account.name}!`
            });

            setIsLoading(false);

            // Navigate to main app
            setTimeout(() => {
                navigate("/");
            }, 500);
        }, 1500);
    };

    return (
        <>
            <AccountSelector
                open={showAccountSelector}
                onClose={() => setShowAccountSelector(false)}
                provider={selectedProvider}
                onSelect={handleAccountSelect}
            />

            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                {/* Floating code symbols */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-20 text-6xl text-primary animate-float">&lt;/&gt;</div>
                    <div className="absolute top-40 right-32 text-4xl text-accent animate-float delay-300">{ }</div>
                    <div className="absolute bottom-32 left-40 text-5xl text-success animate-float delay-700">[ ]</div>
                    <div className="absolute bottom-20 right-20 text-3xl text-warning animate-float delay-500">=&gt;</div>
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left side - Branding */}
                    <div className="hidden lg:block space-y-8 animate-slide-up">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/50">
                                <Code2 className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold gradient-text">Hackathon Habit</h1>
                                <p className="text-muted-foreground">Master coding, one day at a time</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Daily Challenges</h3>
                                    <p className="text-sm text-muted-foreground">AI-generated problems tailored to your skill level</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                                    <Trophy className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Track Your Streak</h3>
                                    <p className="text-sm text-muted-foreground">Build consistency and level up your skills</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Multi-Language Support</h3>
                                    <p className="text-sm text-muted-foreground">Code in JavaScript, Python, and more</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span>1,234 active coders</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span>10,000+ problems solved today</span>
                        </div>
                    </div>

                    {/* Right side - Login Form */}
                    <div className="w-full max-w-md mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        <div className="glass-card p-8 space-y-6 border-2 border-white/10 shadow-2xl">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
                                <p className="text-muted-foreground">Sign in to continue your coding journey</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-foreground">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-white/20 bg-white/5 cursor-pointer"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span className="text-muted-foreground">Remember me</span>
                                    </label>
                                    <button type="button" className="text-primary hover:underline">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 bg-white/5 border-white/10 hover:bg-white/10 p-0 overflow-hidden"
                                    // onClick={() => handleSocialLogin("Google")} // Disabled for real integration
                                    disabled={isLoading}
                                >
                                    <div id="googleSignInButton" className="w-full h-full flex justify-center items-center"></div>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 bg-white/5 border-white/10 hover:bg-white/10"
                                    onClick={() => handleSocialLogin("GitHub")}
                                    disabled={isLoading}
                                >
                                    <Github className="w-5 h-5 mr-2" />
                                    GitHub
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <button className="text-primary hover:underline font-semibold">
                                    Sign up for free
                                </button>
                            </p>
                        </div>

                        <p className="text-center text-xs text-muted-foreground mt-6">
                            By signing in, you agree to our{" "}
                            <button className="hover:text-primary transition-colors">Terms of Service</button>
                            {" "}and{" "}
                            <button className="hover:text-primary transition-colors">Privacy Policy</button>
                        </p>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Login;
