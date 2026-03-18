import React, { useState } from "react";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: string;
};

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="revamp-accordion">
      <button
        className={`revamp-accordion-header ${isOpen ? "revamp-accordion-header--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {icon && <span className="revamp-accordion-icon">{icon}</span>}
        <span className="revamp-accordion-title">{title}</span>
        <span className="revamp-accordion-chevron">
          {isOpen ? "▼" : "▶"}
        </span>
      </button>
      <div
        className={`revamp-accordion-content ${isOpen ? "revamp-accordion-content--open" : ""}`}
        style={{
          maxHeight: isOpen ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <div className="revamp-accordion-body">{children}</div>
      </div>
    </div>
  );
};

type AccordionGroupProps = {
  children: React.ReactNode;
  allowMultiple?: boolean;
};

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultiple = false,
}) => {
  return (
    <div className="revamp-accordion-group" data-allow-multiple={allowMultiple}>
      {children}
    </div>
  );
};
