import React from "react";
import '../Css/Loading.css'; // if using external CSS

export default function Loading() {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner"></div>
      <span className="loading-text">Loading...</span>
    </div>
  );
}
