type Cells = {
  [key: string]: {
    value: string;
    formula: string;
    dependents?: string[];
  };
};

export function removeIdFromDependents(cells: Cells, id: string): Cells {
  const updatedCells = { ...cells };
  for (const cellId in updatedCells) {
    if (updatedCells[cellId]) {
      const dependents = updatedCells[cellId]?.dependents || [];
      if (dependents.includes(id)) {
        updatedCells[cellId] = {
          ...updatedCells[cellId],
          dependents: dependents.filter((dependentId) => dependentId !== id),
        };
      }
    }
  }
  return updatedCells;
}

type UpdateCellPayload = {
  cellId: string;
  newValue: string;
};

export function updateCell(
  cells: Cells,
  { cellId, newValue }: UpdateCellPayload,
  updateFormula = false
): Cells {
  let updatedCells = { ...cells };

  if (!updatedCells[cellId]) {
    return updatedCells;
  }

  updatedCells[cellId] = {
    ...updatedCells[cellId],
    formula: updateFormula ? newValue : updatedCells[cellId].formula,
    value: newValue,
  };
  cells[cellId]?.dependents?.forEach((dependentId) => {
    updatedCells = updateCell(updatedCells, {
      cellId: dependentId,
      newValue,
    });
  });
  return updatedCells;
}

export function isCircularReference(
  cellState: Cells,
  cellId: string,
  referencedCellId: string
): boolean {
  const visited = new Set<string>();

  function hasCircularReference(currentId: string) {
    if (visited.has(currentId)) {
      return true;
    }
    visited.add(currentId);
    const currentCell = cellState[currentId];
    const dependents = currentCell?.dependents || [];
    for (const dependentId of dependents) {
      if (dependentId === referencedCellId) {
        return true;
      }
      if (hasCircularReference(dependentId)) {
        return true;
      }
      return hasCircularReference(dependentId);
    }
    visited.delete(currentId);
    return false;
  }

  return hasCircularReference(cellId);
}
