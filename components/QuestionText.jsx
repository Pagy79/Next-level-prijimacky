import React from "react";

// Renders question text, turning a trailing "_" fill-in-the-blank marker
// into a small underline slot.
function QuestionText({ text }) {
  const parts = text.split("_");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="inline-block w-8 border-b-2 border-zinc-400 -translate-y-0.5 mx-0.5" />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component

export default QuestionText;
