import type { ConversationAgent } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Conversation Service", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("listAgents", () => {
    it("should fetch conversation agents list", async () => {
      expect.assertions(2);
      const mockAgents: ConversationAgent[] = [
        {
          id: "conversation.home_assistant",
          name: "Home Assistant",
          supported_languages: ["en", "es", "fr"],
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => ({ agents: mockAgents }));

        lifecycle.onReady(async () => {
          const result = await hass.conversation.listAgents();
          expect(spy).toHaveBeenCalledWith({
            type: "conversation/agent/list",
          });
          expect(result).toEqual(mockAgents);
        });
      });
    });

    it("should return empty array when no agents are available", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({ agents: [] }));

        lifecycle.onReady(async () => {
          const result = await hass.conversation.listAgents();
          expect(result).toEqual([]);
        });
      });
    });
  });
});
