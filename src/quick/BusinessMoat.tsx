import { useId } from "react";
import { BUSINESS_MOAT_MAX_LENGTH } from "./business-description";

export function BusinessMoat({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  const id = useId();
  return (
    <div className="business-description business-moat">
      <label htmlFor={id}>
        Was macht Ihr Angebot schwer ersetzbar? <span>Optional</span>
      </label>
      <div className="business-input">
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={BUSINESS_MOAT_MAX_LENGTH}
          rows={3}
          placeholder="Ihr USP oder Moat – aus Ihrer Sicht."
        />
      </div>
    </div>
  );
}
