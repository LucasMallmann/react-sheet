export function unsafeCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.error(error);
  }
  document.body.removeChild(textarea);
}
