import React, { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ChartErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error) {
        console.error("Chart component crashed:", error);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-4 text-center border border-dashed border-red-500/20 rounded-xl bg-red-500/5">
                    <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-sm text-red-400">Analysis unavailable</p>
                </div>
            );
        }

        return this.props.children;
    }
}
