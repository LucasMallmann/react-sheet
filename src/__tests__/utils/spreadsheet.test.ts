import { loadSpreadSheetFromLocalStorage } from "@/utils/spreadsheet";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Spreadsheet", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
  });

  it("should return an empty object when no sheetId is provided", () => {
    const result = loadSpreadSheetFromLocalStorage();
    expect(result).toBeUndefined();
  });

  it("should load the spreadsheet data from local storage", () => {
    const sheetId = "mySheet";
    const mockData = { A1: { value: "1" }, A2: { value: "2" } };
    localStorage.setItem(sheetId, JSON.stringify(mockData));
    const result = loadSpreadSheetFromLocalStorage(sheetId);
    expect(result).toEqual(mockData);
  });

  it("should return an empty object on localStorage error", () => {
    const sheetId = "mySheet";
    localStorage.setItem(sheetId, "invalid JSON");
    const result = loadSpreadSheetFromLocalStorage(sheetId);
    expect(result).toEqual({});
  });
});
