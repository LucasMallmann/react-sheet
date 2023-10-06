function updateCellValue(cells, cellId, newValue, visited = new Set()) {
  if (visited.has(cellId)) {
    throw new Error("Circular dependency detected");
  }

  visited.add(cellId);

  let updatedCells = { ...cells };

  updatedCells[cellId] = {
    ...updatedCells[cellId],
    value: newValue,
  };

  cells[cellId].dependents.forEach((dependentId) => {
    updatedCells = updateCellValue(
      updatedCells,
      dependentId,
      newValue,
      visited
    );
  });

  return updatedCells;
}

const cells = {
  A1: {
    value: "foo",
    formula: "foo",
    dependents: ["A2"],
  },
  A2: {
    value: "aasasd",
    formula: "=0-0",
    dependents: ["A3", "A4", "A5"],
  },
  A3: {
    value: "asdq",
    formula: "=0-2",
    dependents: [],
  },
  A4: {
    value: "ASDQ",
    formula: "=0-1",
    dependents: ["A6"],
  },
  A5: {
    value: "fdgdf",
    formula: "=0-1",
    dependents: [],
  },
  A6: {
    value: "kkkkk",
    formula: "=0-3",
    dependents: ["A1"],
  },
};

const errorCells = {
  A1: {
    value: "foo",
    formula: "foo",
    dependents: ["A3"],
  },
  A2: {
    value: "foo",
    formula: "=0-0",
    dependents: ["A1"],
  },
  A3: {
    value: "foo",
    formula: "=0-0",
    dependents: ["A2"],
  },
};

// Simulate a change in cell '0-0'
// const updatedCells = updateCellValue(cells, "0-0", "new value");
const updatedCells = updateCellValue(cells, "A1", "new value");

console.log(updatedCells);
