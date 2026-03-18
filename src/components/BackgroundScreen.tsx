import React from "react";

interface BackgroundScreenProps {
  backgroundImage: string;
  alt?: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export default function BackgroundScreen({
  backgroundImage,
  alt = "Background",
  className = "",
  contentClassName,
  children,
}: BackgroundScreenProps) {
  const rootClass = ["background-screen", className].filter(Boolean).join(" ");
  const contentClass = ["background-screen__content", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <style>{`
        .background-screen {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #0B0C2A;
          overflow: hidden;
        }

        .background-screen__image {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .background-screen__content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <img className="background-screen__image" src={backgroundImage} alt={alt} />
      <div className={contentClass}>{children}</div>
    </div>
  );
}
