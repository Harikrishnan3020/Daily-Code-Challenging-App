import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chrome, Github, Check } from "lucide-react";

import { User as Account } from "@/types";

interface AccountSelectorProps {
    open: boolean;
    onClose: () => void;
    provider: "Google" | "GitHub";
    onSelect: (account: Account) => void;
}

// Mock accounts for demonstration
const mockGoogleAccounts: Account[] = [
    {
        id: "1",
        email: "john.doe@gmail.com",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        provider: "Google"
    },
    {
        id: "2",
        email: "jane.smith@gmail.com",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        provider: "Google"
    },
    {
        id: "3",
        email: "alex.dev@gmail.com",
        name: "Alex Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        provider: "Google"
    }
];

const mockGitHubAccounts: Account[] = [
    {
        id: "1",
        email: "developer@github.com",
        name: "GitHub Developer",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GitHub1",
        provider: "GitHub"
    },
    {
        id: "2",
        email: "coder@github.com",
        name: "Pro Coder",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GitHub2",
        provider: "GitHub"
    }
];

const AccountSelector = ({ open, onClose, provider, onSelect }: AccountSelectorProps) => {
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const accounts = provider === "Google" ? mockGoogleAccounts : mockGitHubAccounts;

    const handleSelect = (account: Account) => {
        setSelectedAccount(account);
    };

    const handleContinue = () => {
        if (selectedAccount) {
            onSelect(selectedAccount);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        {provider === "Google" ? (
                            <Chrome className="w-5 h-5 text-primary" />
                        ) : (
                            <Github className="w-5 h-5 text-white" />
                        )}
                        Choose a {provider} account
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        to continue to Hackathon Habit
                    </p>

                    <div className="space-y-2">
                        {accounts.map((account) => (
                            <button
                                key={account.id}
                                onClick={() => handleSelect(account)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/5 ${selectedAccount?.id === account.id
                                    ? "border-primary bg-primary/10"
                                    : "border-white/10 bg-white/5"
                                    }`}
                            >
                                <img
                                    src={account.avatar}
                                    alt={account.name}
                                    className="w-10 h-10 rounded-full bg-white/10"
                                />
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-white">{account.name}</p>
                                    <p className="text-xs text-muted-foreground">{account.email}</p>
                                </div>
                                {selectedAccount?.id === account.id && (
                                    <Check className="w-5 h-5 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all mt-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xl">+</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">Use another account</p>
                        </div>
                    </button>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedAccount}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AccountSelector;
