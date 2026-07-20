interface HighlightTextProps {
  text: string;
  highlight?: string;
  className?: string;
}

export default function HighlightText({ text, highlight, className = "" }: HighlightTextProps) {
  if (!highlight || !highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-emerald-200/90 text-emerald-950 font-extrabold rounded-xs px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
