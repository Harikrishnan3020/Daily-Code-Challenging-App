import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Supported programming languages for the editor */
export type Language = "javascript" | "python" | "c" | "cpp";

interface CodeEditorProps {
  /** Current code string value */
  value: string;
  /** Callback emitted when code changes */
  onChange: (value: string) => void;
  /** Currently selected programming language */
  language: Language;
  /** Callback emitted when language selection changes */
  onLanguageChange: (lang: Language) => void;
}

/**
 * CodeEditor Component
 * A functional text area with line numbers and language selection.
 * Handles syntax highlighting (basic) via font-mono and raw text input.
 */
const CodeEditor = ({ value, onChange, language, onLanguageChange }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the current editor content to the clipboard.
   * Shows a temporary 'Copied!' feedback state.
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const lineNumbers = value.split("\n").length;

  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
      {/* Toolbar: Language selector and Copy button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Solution</span>

          <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
            <SelectTrigger className="w-[120px] h-7 text-xs bg-primary/10 border-primary/20 text-primary">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
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
        {/* Line Numbers Column */}
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

        {/* Editor Textarea */}
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
