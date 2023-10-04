export function numberToChar(num: number) {
  let result = "";
  while (num > 0) {
    const remainder = (num - 1) % 26; // Adjust for 1-based index
    result = String.fromCharCode("A".charCodeAt(0) + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
}
