function charToNumber(letters: string) {
  return (
    letters
      // Get each letter on its own
      .split("")
      // Smaller first and then bigger
      .reverse()
      // Convert them to base 26 numbers
      .map((letter, index) =>
        index === 0
          ? letter.toLowerCase().charCodeAt(0) - 97
          : // The addition of 1 here is to oppose what we did for numberToLetter
            letter.toLowerCase().charCodeAt(0) - 97 + 1
      )
      // Convert base 26 to base 10
      .map((base26Number, position) => base26Number * 26 ** position)
      // Sum
      .reduce((sum: number, number: number) => sum + number, 0)
  );
}

export function cellIdtoMatrixIndices(cellId: string) {
  const capitalizedCellId = cellId.toUpperCase();
  const columnLetters = capitalizedCellId.match(/[A-Z]+/)![0];
  const columnNumber = charToNumber(columnLetters);

  const rowNumber = parseInt(capitalizedCellId.match(/[0-9]+/)![0]) - 1;

  return {
    column: columnNumber,
    row: rowNumber,
  };
}
