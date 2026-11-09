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
        Wo sehen Sie den Burggraben Ihres Unternehmens? <span>Optional</span>
      </label>
      <div className="business-input">
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={BUSINESS_MOAT_MAX_LENGTH}
          rows={3}
          placeholder="Was schützt Ihr Geschäft vor Nachahmern?"
        />
      </div>
    </div>
  );
}
