import { hassTestRunner } from "../mock_assistant";

describe("Fixtures", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    jest.restoreAllMocks();
  });

  describe("Entity interactions", () => {
    it("does stuff", async () => {
      expect.assertions(1);
      //
    });
  });
});
