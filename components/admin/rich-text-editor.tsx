"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Undo, Redo, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirtyState } from "@/components/admin/dirty-state-provider";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
}

export function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const { setDirty } = useDirtyState();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe fallback for old plaintext data: if it doesn't contain HTML tags, wrap in <p>
  const initialValue = isMounted && defaultValue && !defaultValue.includes("<") && !defaultValue.includes(">")
    ? defaultValue.split(/\n{2,}/).map(p => `<p>${p}</p>`).join("")
    : defaultValue;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand underline underline-offset-2',
        },
      }),
    ],
    content: initialValue || "",
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
      setDirty(true);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    immediatelyRender: false,
  });

  if (!isMounted) {
    return (
      <div className="rounded-[var(--radius-md)] border border-line bg-surface min-h-[260px] animate-pulse" />
    );
  }

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean,
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-2 text-ink-muted hover:bg-elevated hover:text-ink rounded-[var(--radius-sm)] transition-colors",
        isActive && "bg-elevated text-ink ring-1 ring-line-strong",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-line focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent transition-shadow bg-surface">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-elevated/50 p-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-line mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-line mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-line mx-1" />

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()}>
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
        )}

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="bg-surface max-h-[600px] overflow-y-auto cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
