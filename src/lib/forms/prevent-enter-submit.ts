import type { KeyboardEvent } from "react";

/** Stop Enter in inputs/selects from submitting the form; use the Save button instead. */
export function preventImplicitFormSubmitOnEnter(
  event: KeyboardEvent<HTMLFormElement>,
) {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) {
    return;
  }

  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
    event.preventDefault();
  }
}
