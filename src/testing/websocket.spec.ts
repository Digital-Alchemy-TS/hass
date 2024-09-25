import { hassTestRunner } from "../mock_assistant";

describe("Websocket", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    jest.restoreAllMocks();
  });

  describe("API Interactions", () => {
    it("should emit events onConnect", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let hit = false;
        hass.socket.onConnect(() => (hit = true));
        lifecycle.onReady(() => {
          expect(hit).toBe(true);
        });
      });
    });

    it("should emit a socket message with subscribeEvents", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, context }) => {
        const spy = jest
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          await hass.socket.subscribe({
            context,
            event_type: "test",
            exec: () => {},
          });
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
              event_type: "test",
              type: "subscribe_events",
            }),
          );
        });
      });
    });

    it("should emit a socket message with fireEvent", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = jest
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const data = { example: "data" };
          await hass.socket.fireEvent("test_event", data);
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
              event_data: data,
              event_type: "test_event",
              type: "fire_event",
            }),
          );
        });
      });
    });
  });
});
