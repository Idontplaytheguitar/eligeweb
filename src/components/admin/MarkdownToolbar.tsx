"use client";

import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInsert: (newContent: string, cursorOffset?: number) => void;
}

type MarkdownAction = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prefix: string;
  suffix: string;
  placeholder?: string;
  block?: boolean;
};

const actions: MarkdownAction[] = [
  { icon: Bold, label: "Negrita", prefix: "**", suffix: "**", placeholder: "texto" },
  { icon: Italic, label: "Itálica", prefix: "*", suffix: "*", placeholder: "texto" },
  { icon: Heading2, label: "Título 2", prefix: "## ", suffix: "", placeholder: "Título", block: true },
  { icon: Heading3, label: "Título 3", prefix: "### ", suffix: "", placeholder: "Subtítulo", block: true },
  { icon: List, label: "Lista", prefix: "- ", suffix: "", placeholder: "elemento", block: true },
  { icon: ListOrdered, label: "Lista numerada", prefix: "1. ", suffix: "", placeholder: "elemento", block: true },
  { icon: Link, label: "Enlace", prefix: "[", suffix: "](url)", placeholder: "texto del enlace" },
  { icon: Image, label: "Imagen", prefix: "![", suffix: "](url)", placeholder: "descripción" },
  { icon: Quote, label: "Cita", prefix: "> ", suffix: "", placeholder: "cita", block: true },
  { icon: Code, label: "Código", prefix: "`", suffix: "`", placeholder: "código" },
  { icon: Minus, label: "Separador", prefix: "\n---\n", suffix: "", placeholder: "" },
];

export function MarkdownToolbar({ textareaRef, onInsert }: MarkdownToolbarProps) {
  const handleAction = (action: MarkdownAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let newText: string;
    let cursorOffset: number;

    if (action.block && start > 0 && text[start - 1] !== "\n") {
      const prefix = "\n" + action.prefix;
      if (selectedText) {
        newText =
          text.substring(0, start) +
          prefix +
          selectedText +
          action.suffix +
          text.substring(end);
        cursorOffset = start + prefix.length + selectedText.length + action.suffix.length;
      } else {
        const placeholder = action.placeholder || "";
        newText =
          text.substring(0, start) +
          prefix +
          placeholder +
          action.suffix +
          text.substring(end);
        cursorOffset = start + prefix.length + placeholder.length;
      }
    } else {
      if (selectedText) {
        newText =
          text.substring(0, start) +
          action.prefix +
          selectedText +
          action.suffix +
          text.substring(end);
        cursorOffset = start + action.prefix.length + selectedText.length + action.suffix.length;
      } else {
        const placeholder = action.placeholder || "";
        newText =
          text.substring(0, start) +
          action.prefix +
          placeholder +
          action.suffix +
          text.substring(end);
        cursorOffset = start + action.prefix.length + placeholder.length;
      }
    }

    onInsert(newText, cursorOffset);

    setTimeout(() => {
      textarea.focus();
      if (!selectedText && action.placeholder) {
        const selectStart = cursorOffset - action.placeholder.length;
        textarea.setSelectionRange(selectStart, cursorOffset);
      } else {
        textarea.setSelectionRange(cursorOffset, cursorOffset);
      }
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b rounded-t-lg">
      {actions.map((action: MarkdownAction) => (
        <Button
          key={action.label}
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleAction(action)}
          title={action.label}
        >
          <action.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
