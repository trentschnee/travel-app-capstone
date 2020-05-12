import {changeUi} from "./app"
test("updateUI is defined", async () => {
    expect(changeUi).toBeDefined();
  });
  test("updateUI is a function", async () => {
    expect(typeof changeUi).toBe("function");
  });