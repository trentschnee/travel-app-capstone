import { changeUi } from "./app"
// Test if updateUI is defined and a function
test("updateUI is defined", async () => {
    expect(changeUi).toBeDefined();
});
  test("updateUI is a function", async () => {
    expect(typeof changeUi).toBe("function");
  });