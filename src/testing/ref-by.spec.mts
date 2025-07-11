import dayjs from "dayjs";

import { ENTITY_STATE } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";
import { ANY_ENTITY } from "../user.mts";

describe("References", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("loading", function () {
    describe("refBy.id", () => {
      it("can grab references by id", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor).toBeDefined();
            expect(sensor.state).toBe("unavailable");
          });
        });
      });
    });

    describe("domain", () => {
      it("load references by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.domain("sensor");
            expect(sensor.length).toBe(11);
          });
        });
      });
    });

    describe("unique_id", () => {
      it("load references by unique_id", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.unique_id(
              "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
            );
            expect(sensor?.entity_id).toBe("sensor.magic");
          });
        });
      });
    });

    describe("label", () => {
      it("load references by label", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse");
            expect(list.length).toBe(7);
          });
        });
      });

      it("load references by label limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse", "light");
            expect(list.length).toBe(0);
          });
        });
      });
    });

    describe("area", () => {
      it("load references by area", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom");
            const kitchen = hass.refBy.area("kitchen");
            expect(bedroom.length).toBe(2);
            expect(kitchen.length).toBe(1);
          });
        });
      });

      it("load references by area limiting by domain", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom", "light");
            const kitchen = hass.refBy.area("kitchen", "light");
            expect(bedroom.length).toBe(1);
            expect(kitchen.length).toBe(0);
          });
        });
      });
    });

    describe("device", () => {
      it("load references by device", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device("308e39cf50a9fc6c30b4110724ed1f2e");
            expect(synapse.length).toBe(9);
          });
        });
      });

      it("load references by device limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device("308e39cf50a9fc6c30b4110724ed1f2e", "light");
            expect(synapse.length).toBe(0);
          });
        });
      });
    });

    describe("platform", () => {
      it("load references by platform", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse");
            expect(synapse.length).toBe(7);
          });
        });
      });

      it("load references by platform limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse", "light");
            expect(synapse.length).toBe(0);
          });
        });
      });
    });

    describe("floor", () => {
      it("load references by floor", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs");
            expect(synapse.length).toBe(3);
          });
        });
      });

      it("load references by floor limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs", "light");
            expect(synapse.length).toBe(0);
          });
        });
      });
    });
  });

  describe("functionality", () => {
    describe("operators", () => {
      it("has", async () => {
        expect.assertions(15);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("switch.bedroom_lamp");
            // always there stuff
            expect("does not exist" in entity).toBe(false);
            [
              "attributes",
              "entity_id",
              "history",
              "last",
              "nextState",
              "once",
              "onUpdate",
              "previous",
              "removeAllListeners",
              "state",
              "waitForState",
            ].forEach(property => expect(property in entity).toBe(true));
            // service calls exist too
            ["toggle", "turn_off", "turn_on"].forEach(method =>
              expect(method in entity).toBe(true),
            );
          });
        });
      });

      it("ownKeys", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("switch.bedroom_lamp");
            const keys = Object.keys(entity);
            // note: each section sorted alphabetically
            expect(keys).toEqual([
              // hard coded
              "entity_id",
              "state",
              "attributes",
              "last_changed",
              "last_reported",
              "last_updated",
              "context",
              "history",
              "last",
              "nextState",
              "once",
              "onUpdate",
              "previous",
              "removeAllListeners",
              "waitForState",
              // services
              "toggle",
              "turn_off",
              "turn_on",
            ]);
          });
        });
      });
      describe("set", () => {
        it("state", () => {
          // stub
        });
        it("attributes", () => {
          // stub
        });
        it("everything else", () => {
          // stub
        });
      });
    });

    describe("get", () => {
      it("references have attributes", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect("attributes" in sensor).toBe(true);
            expect(sensor.attributes).toEqual(expect.objectContaining({ friendly_name: "magic" }));
          });
        });
      });

      // mental note: legacy test
      // better covered by the ownKeys & has operator tests now
      it("references do not return random attributes", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            // @ts-expect-error it's the test
            expect(sensor.foo).toBeUndefined();
          });
        });
      });

      it("references provide last_* as dayjs", async () => {
        expect.assertions(3);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor.last_changed instanceof dayjs).toBe(true);
            expect(sensor.last_reported instanceof dayjs).toBe(true);
            expect(sensor.last_updated instanceof dayjs).toBe(true);
          });
        });
      });

      it("passes through history calls", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(async () => {
            const result = [] as ENTITY_STATE<ANY_ENTITY>[];
            const spy = vi
              .spyOn(hass.fetch, "fetchEntityHistory")
              .mockImplementation(async () => result);
            const from = new Date();
            const to = new Date();
            const entity_id = "sensor.magic";

            const entity = hass.refBy.id(entity_id);
            const out = await entity.history(from, to);
            expect(spy).toHaveBeenCalledWith(entity_id, from, to);
            expect(out).toBe(result);
          });
        });
      });
    });
  });
});
