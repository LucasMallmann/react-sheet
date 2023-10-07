export function loadSpreadSheetFromLocalStorage(sheetId?: string) {
  try {
    if (!sheetId) {
      return;
    }
    const sheetFromLocalStorage = localStorage.getItem(sheetId);
    return JSON.parse(sheetFromLocalStorage || "{}");
  } catch (error) {
    return {};
  }
}
