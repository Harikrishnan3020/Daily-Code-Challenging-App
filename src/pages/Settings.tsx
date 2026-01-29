import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

/**
 * Predefined color themes.
 * Each theme defines CSS variable values for Shadcn/Tailwind colors.
 * colors: Maps CSS variables (e.g. --background) to HSL values.
 */
const THEMES = [
    {
        name: "Default",
        colors: {
            "--background": "222 47% 6%",
            "--card": "222 47% 8%",
            "--popover": "222 47% 8%",
            "--muted": "222 30% 18%",
            "--border": "222 30% 18%",
            "--input": "222 30% 14%"
        },
        preview: "#0d1117"
    },
    {
        name: "Midnight",
        colors: {
            "--background": "0 0% 5%",
            "--card": "0 0% 8%",
            "--popover": "0 0% 8%",
            "--muted": "0 0% 15%",
            "--border": "0 0% 15%",
            "--input": "0 0% 12%"
        },
        preview: "#0d0d0d"
    },
    {
        name: "Deep Purple",
        colors: {
            "--background": "270 50% 10%",
            "--card": "270 50% 13%",
            "--popover": "270 50% 13%",
            "--muted": "270 30% 20%",
            "--border": "270 30% 20%",
            "--input": "270 30% 16%"
        },
        preview: "#1a0d26"
    },
    {
        name: "Slate",
        colors: {
            "--background": "215 25% 10%",
            "--card": "215 25% 13%",
            "--popover": "215 25% 13%",
            "--muted": "215 15% 20%",
            "--border": "215 15% 20%",
            "--input": "215 15% 16%"
        },
        preview: "#131720"
    },
    {
        name: "Forest",
        colors: {
            "--background": "150 50% 6%",
            "--card": "150 50% 9%",
            "--popover": "150 50% 9%",
            "--muted": "150 30% 15%",
            "--border": "150 30% 15%",
            "--input": "150 30% 12%"
        },
        preview: "#081a10"
    },
    {
        name: "Ocean",
        colors: {
            "--background": "200 50% 10%",
            "--card": "200 50% 13%",
            "--popover": "200 50% 13%",
            "--muted": "200 30% 20%",
            "--border": "200 30% 20%",
            "--input": "200 30% 16%"
        },
        preview: "#0d1f26"
    },
    {
        name: "Crimson",
        colors: {
            "--background": "340 40% 10%",
            "--card": "340 40% 13%",
            "--popover": "340 40% 13%",
            "--muted": "340 30% 20%",
            "--border": "340 30% 20%",
            "--input": "340 30% 16%"
        },
        preview: "#260d13"
    },
    {
        name: "Amber",
        colors: {
            "--background": "30 40% 10%",
            "--card": "30 40% 13%",
            "--popover": "30 40% 13%",
            "--muted": "30 30% 20%",
            "--border": "30 30% 20%",
            "--input": "30 30% 16%"
        },
        preview: "#261a0d"
    },
    {
        name: "Graphite",
        colors: {
            "--background": "0 0% 15%",
            "--card": "0 0% 18%",
            "--popover": "0 0% 18%",
            "--muted": "0 0% 25%",
            "--border": "0 0% 25%",
            "--input": "0 0% 22%"
        },
        preview: "#262626"
    },
];

/**
 * Settings Page
 * Allows users to configure application settings such as themes and API keys.
 * Persists changes to localStorage.
 */
const Settings = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState("");
    const [currentTheme, setCurrentTheme] = useState("Default");

    useEffect(() => {
        // Load saved settings
        const savedApiKey = localStorage.getItem("hackathon-habit-api-key");
        const savedThemeName = localStorage.getItem("hackathon-habit-theme-name") || "Default";
        const savedThemeValues = localStorage.getItem("hackathon-habit-theme-values");

        if (savedApiKey) setApiKey(savedApiKey);
        setCurrentTheme(savedThemeName);

        // Apply theme values if available
        if (savedThemeValues) {
            try {
                const themeColors = JSON.parse(savedThemeValues);
                Object.entries(themeColors).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(key, value as string);
                });
            } catch (error) {
                console.error("Failed to parse saved theme values:", error);
            }
        } else {
            // If no specific theme values are saved, apply the default theme's values
            const defaultTheme = THEMES.find(theme => theme.name === "Default");
            if (defaultTheme) {
                Object.entries(defaultTheme.colors).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(key, value);
                });
            }
        }
    }, []);

    const handleSaveApiKey = () => {
        localStorage.setItem("hackathon-habit-api-key", apiKey);
        toast({
            title: "Settings Saved",
            description: "Your API key has been updated successfully.",
        });
    };

    const handleThemeChange = (theme: typeof THEMES[0]) => {
        setCurrentTheme(theme.name);

        // Apply all colors
        Object.entries(theme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        localStorage.setItem("hackathon-habit-theme-name", theme.name);
        localStorage.setItem("hackathon-habit-theme-values", JSON.stringify(theme.colors));

        toast({
            title: "Theme Updated",
            description: `${theme.name} theme applied successfully.`,
        });
    };

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Customize your experience
                        </p>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <Moon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">Appearance</h2>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Background Theme</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.name}
                                    onClick={() => handleThemeChange(theme)}
                                    className={`
                    group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300
                    border border-white/5 hover:border-primary/50 hover:bg-white/5
                    ${currentTheme === theme.name ? 'ring-2 ring-primary bg-white/5' : ''}
                  `}
                                >
                                    <div
                                        className="w-full aspect-video rounded-lg shadow-lg"
                                        style={{ backgroundColor: `hsl(${theme.colors["--background"]})` }}
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                        {theme.name}
                                    </span>
                                    {currentTheme === theme.name && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* API Configuration Section */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="p-2 rounded-lg bg-warning/20 text-warning">
                            <Key className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">API Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="apiKey" className="text-sm font-medium text-muted-foreground">
                                Your User API Key
                            </label>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter your API Key..."
                                        className="bg-black/20 border-white/10 focus:border-primary/50 pr-10"
                                    />
                                </div>
                                <Button onClick={handleSaveApiKey} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Key
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This key is stored locally in your browser and used for personalized features.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
