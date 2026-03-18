import * as React from "react";

type RadioGroupContextValue = {
  name: string;
  value: string | null;
  onChange: (nextValue: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

type RadioGroupProps = {
  name: string;
  value: string | null;
  onChange: (nextValue: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function RadioGroup({ name, value, onChange, children, className }: RadioGroupProps) {
  const classes = ["revamp-radioGroup", className].filter(Boolean).join(" ");

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div className={classes} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

type RadioOptionProps = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function RadioOption({
  value,
  label,
  description,
  disabled = false,
  className,
}: RadioOptionProps) {
  const context = React.useContext(RadioGroupContext);
  const id = React.useId();

  if (!context) {
    throw new Error("RadioOption must be used within a RadioGroup.");
  }

  const checked = context.value === value;
  const classes = [
    "revamp-radioOption",
    checked ? "is-checked" : null,
    disabled ? "is-disabled" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes} htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        disabled={disabled}
        className="revamp-radioInput"
        onChange={() => context.onChange(value)}
      />
      <span className="revamp-radioIndicator" aria-hidden="true" />
      <span className="revamp-radioText">
        <span className="revamp-radioLabel">{label}</span>
        {description ? (
          <span className="revamp-radioDescription">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
