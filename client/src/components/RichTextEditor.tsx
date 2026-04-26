import { useEffect, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import clsx from "clsx";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const EMOJIS = ["✨", "🔮", "💫", "🌙", "🧿", "🪬", "🙏", "❤️", "😊", "🔥", "⭐", "🎯"];

function ToolbarButton({
  active,
  onClick,
  children
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-xl border px-3 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl transition",
        "border-white/30 bg-white/40 text-slate-800 hover:bg-white/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/55",
        active && "ring-2 ring-indigo-400/60"
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true })
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[170px] rounded-2xl border border-white/30 bg-white/35 px-4 py-3 shadow-glass outline-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30"
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value != null && value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </ToolbarButton>

        {[1, 2, 3].map((lvl) => (
          <ToolbarButton
            key={lvl}
            active={editor.isActive("heading", { level: lvl })}
            onClick={() => editor.chain().focus().toggleHeading({ level: lvl as 1 | 2 | 3 }).run()}
          >
            H{lvl}
          </ToolbarButton>
        ))}

        <label className="ml-1 flex items-center gap-2 rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold text-slate-800 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          Text
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-5 w-7 cursor-pointer bg-transparent"
            aria-label="Text color"
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold text-slate-800 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          Highlight
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            className="h-5 w-7 cursor-pointer bg-transparent"
            aria-label="Highlight color"
          />
        </label>

        <ToolbarButton onClick={() => editor.chain().focus().unsetColor().run()}>Clear color</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetHighlight().run()}>
          Clear highlight
        </ToolbarButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Emojis</span>
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => editor.chain().focus().insertContent(e).run()}
            className="rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-sm shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-slate-950/55"
            aria-label={`Insert ${e}`}
          >
            {e}
          </button>
        ))}
      </div>

      {placeholder ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{placeholder}</p>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}

