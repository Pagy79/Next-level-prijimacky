import React from "react";

// Renders question text with:
// - trailing/inline "_" as a small underline blank slot
// - **highlighted phrase** as colored emphasis (for "zvýrazněno" items)
function renderWithBlanks(text, keyPrefix) {
  const parts = text.split("_");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <React.Fragment key={`${keyPrefix}-blank-${i}`}>
      {part}
      {i < parts.length - 1 && (
        <span className="inline-block w-8 border-b-2 border-zinc-400 -translate-y-0.5 mx-0.5" />
      )}
    </React.Fragment>
  ));
}

function QuestionText({ text }) {
  // Split on **...** pairs; odd segments are highlighted
  const segments = text.split(/\*\*/);
  if (segments.length === 1) {
    return <>{renderWithBlanks(text, "t")}</>;
  }

  return (
    <>
      {segments.map((segment, i) => {
        const content = renderWithBlanks(segment, `s${i}`);
        if (i % 2 === 1) {
          return (
            <span
              key={`hl-${i}`}
              className="font-bold text-cyan-300 underline decoration-cyan-300/80 underline-offset-2"
            >
              {content}
            </span>
          );
        }
        return <React.Fragment key={`plain-${i}`}>{content}</React.Fragment>;
      })}
    </>
  );
}

export default QuestionText;
