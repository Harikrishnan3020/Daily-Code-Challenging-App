import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodeEditor = ({ value, onChange, language = "javascript" }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineNumbers = value.split("\n").length;

  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Solution</span>
          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
            {language}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="flex min-h-[300px] md:min-h-[400px]">
        {/* Line numbers */}
        <div className="flex flex-col items-end px-3 py-4 bg-editor-bg/50 border-r border-border/30 select-none">
          {Array.from({ length: Math.max(lineNumbers, 15) }, (_, i) => (
            <span
              key={i}
              className="text-xs font-mono text-muted-foreground/50 leading-6"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Editor area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="// Write your solution here..."
          className="flex-1 p-4 bg-editor-bg resize-none outline-none font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground/40 focus:bg-editor-bg transition-colors"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
