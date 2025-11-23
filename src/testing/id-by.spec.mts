import { hassTestRunner } from "../mock_assistant/index.mts";
import type { PICK_ENTITY } from "../user.mts";

afterEach(async () => {
  await hassTestRunner.teardown();
  vi.restoreAllMocks();
});

describe("enabled entities", () => {
  describe("area", () => {
    it("find entities by area", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const bedroom = hass.idBy.area("bedroom");
          const kitchen = hass.idBy.area("kitchen");
          expect(bedroom.length).toBe(2);
          expect(kitchen.length).toBe(1);
        });
      });
    });

    it("finds entities only related by device", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          // merges 1 from direct area, 2 via device
          // ignores 2 from the device assigned to another area
          const list = hass.idBy.area("test") as PICK_ENTITY[];
          const expected = [
            "sensor.sun_next_dusk",
            "climate.hallway_thermostat",
            "binary_sensor.garage_door",
          ] as PICK_ENTITY[];
          expect(expected.every(expected => list.includes(expected))).toBe(true);
        });
      });
    });

    it("find entities by area limiting by domain", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const bedroom = hass.idBy.area("bedroom", "light");
          const kitchen = hass.idBy.area("kitchen", "light");
          expect(bedroom.length).toBe(1);
          expect(kitchen.length).toBe(0);
        });
      });
    });
  });

  describe("label", () => {
    it("find entities by label", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.label("synapse");
          expect(synapse.length).toBe(7);
        });
      });
    });

    it("find entities by label limiting by domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.label("synapse", "light");
          expect(synapse.length).toBe(0);
        });
      });
    });
  });

  describe("device", () => {
    it("find entities by device", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.device("308e39cf50a9fc6c30b4110724ed1f2e");
          expect(synapse.length).toBe(9);
        });
      });
    });

    it("find entities by device limiting by domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.device("308e39cf50a9fc6c30b4110724ed1f2e", "light");
          expect(synapse.length).toBe(0);
        });
      });
    });
  });

  describe("platform", () => {
    it("find entities by platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.platform("synapse");
          expect(synapse.length).toBe(11);
        });
      });
    });

    it("find entities by platform limiting by domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.platform("synapse", "light");
          expect(synapse.length).toBe(1);
        });
      });
    });
  });

  describe("floor", () => {
    it("find entities by floor", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.floor("downstairs");
          expect(synapse.length).toBe(3);
        });
      });
    });

    it("find entities by floor limiting by domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.floor("downstairs", "light");
          expect(synapse.length).toBe(0);
        });
      });
    });
  });

  describe("unique_id", () => {
    it("find entity by unique_id without platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.idBy.unique_id(
            "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
          );
          expect(entity).toBe("sensor.magic");
        });
      });
    });

    it("find entity by unique_id with matching platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.idBy.unique_id(
            "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
            "synapse",
          );
          expect(entity).toBe("sensor.magic");
        });
      });
    });

    it("find entity by unique_id with non-matching platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.idBy.unique_id(
            "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
            "sun",
          );
          expect(entity).toBeUndefined();
        });
      });
    });

    it("find entity by unique_id with different platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.idBy.unique_id("5622d76001a335e3ea893c4d60d31b3d-next_dawn", "sun");
          expect(entity).toBe("sensor.sun_next_dawn");
        });
      });
    });
  });
});

describe("disabled entities", () => {
  beforeAll(() => {
    hassTestRunner
      // .emitLogs()
      .configure({
        hass: {
          FILTER_DISABLED_ENTITIES_ID_BY: false,
        },
      });
  });
  describe("area", () => {
    it("find entities by area", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const bedroom = hass.idBy.area("bedroom");
          const kitchen = hass.idBy.area("kitchen");
          expect(bedroom.length).toBe(4);
          expect(kitchen.length).toBe(3);
        });
      });
    });

    it("find entities by area limiting by domain", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const bedroom = hass.idBy.area("bedroom", "light");
          const kitchen = hass.idBy.area("kitchen", "light");
          expect(bedroom.length).toBe(1);
          expect(kitchen.length).toBe(1);
        });
      });
    });
  });

  describe("label", () => {
    it("find entities by label", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.label("synapse");
          expect(synapse.length).toBe(9);
        });
      });
    });
  });

  describe("device", () => {
    it("find entities by device", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.device("308e39cf50a9fc6c30b4110724ed1f2e");
          expect(synapse.length).toBe(12);
        });
      });
    });
  });

  describe("platform", () => {
    it("find entities by platform", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.platform("synapse");
          expect(synapse.length).toBe(12);
        });
      });
    });
  });

  describe("floor", () => {
    it("find entities by floor", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.floor("downstairs");
          expect(synapse.length).toBe(6);
        });
      });
    });

    it("find entities by floor limiting by domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const synapse = hass.idBy.floor("downstairs", "light");
          expect(synapse.length).toBe(1);
        });
      });
    });
  });
});
