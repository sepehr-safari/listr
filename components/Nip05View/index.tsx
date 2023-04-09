function ColoredText({ text }: { text: string }) {
  return (
    <div className="bg-gradient-to-r from-warning to-info bg-clip-text text-xs font-bold leading-5 text-transparent">
      {text}
    </div>
  );
}

export default function Nip05View({ text }: { text: string }) {
  if (text.length < 26) {
    return <ColoredText text={text} />;
  }

  const trimmedText = text.slice(0, 10) + '...' + text.slice(-15);

  return (
    <div className="dropdown dropdown-hover">
      <label tabIndex={0}>
        <ColoredText text={trimmedText} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content menu rounded-xl bg-accent p-2 text-xs text-accent-content"
      >
        {text}
      </div>
    </div>
  );
}
