import React from "react";

export default function CodeBlock({ value, rows = 8 }) {
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {}

  return (
    <textarea
      rows={rows}
      value={jsonFormatted}
      className="tx-block-code-like-content"
      disabled
    />
  );
}
