import type { TServiceParams } from "@digital-alchemy/core";
import { debounce, eachSeries, InternalError } from "@digital-alchemy/core";

import type { AreaCreate, AreaDetails, HassAreaService } from "../index.mts";
import { AREA_REGISTRY_UPDATED, EARLY_ON_READY, ENTITY_REGISTRY_UPDATED, perf } from "../index.mts";
import type { ANY_ENTITY, TAreaId } from "../user.mts";

export function Area({
  hass,
  context,
  config,
  logger,
  event,
  lifecycle,
}: TServiceParams): HassAreaService {
  void hass.socket.subscribe({
    context,
    event_type: "area_registry_updated",
    async exec() {
      const ms = perf();
      await debounce(AREA_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
      hass.area.current = await hass.area.list();
      logger.debug(`area registry updated`);
      event.emit(AREA_REGISTRY_UPDATED);
      hass.diagnostics.area?.registry_update.publish({ ms: ms() });
    },
  });

  hass.socket.onConnect(async () => {
    let loading = new Promise<void>(async done => {
      hass.area.current = await hass.area.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
  });

  async function list() {
    return await hass.socket.sendMessage<AreaDetails[]>({
      type: "config/area_registry/list",
    });
  }

  /**
   * 1. emit delete message
   * 2. hass does stuff internally
   * 3. hass emits update message
   * 4. promise resolves
   */
  async function deleteArea(area_id: TAreaId) {
    return await new Promise<void>(async done => {
      event.once(AREA_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        area_id,
        type: "config/area_registry/delete",
      });
    });
  }

  async function create(details: AreaCreate) {
    return await new Promise<void>(async done => {
      event.once(AREA_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        floor_id: "",
        icon: "",
        labels: [],
        picture: "",
        type: "config/area_registry/create",
        ...details,
      });
    });
  }

  async function apply(area: TAreaId, entities: ANY_ENTITY[]) {
    const out = { updated: [] as ANY_ENTITY[] };
    await eachSeries(entities, async (entity: ANY_ENTITY) => {
      const details = hass.entity.registry.current.find(item => item.entity_id === entity);
      if (!details) {
        throw new InternalError(
          context,
          "UNKNOWN_ENTITY",
          `Cannot find ${entity} in entity registry`,
        );
      }
      if (details.area_id === area) {
        return;
      }
      await new Promise<void>(async done => {
        event.once(ENTITY_REGISTRY_UPDATED, done);
        logger.trace({ area, entity }, `setting area`);
        out.updated.push(entity);
        await hass.socket.sendMessage({
          area_id: area,
          entity_id: entity,
          type: "config/entity_registry/update",
        });
      });
    });
    return out;
  }

  async function update(details: AreaDetails) {
    return await new Promise<void>(async done => {
      event.once(AREA_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        type: "config/area_registry/update",
        ...details,
      });
    });
  }

  return {
    apply,
    create,
    current: [] as AreaDetails[],
    delete: deleteArea,
    list,
    update,
  };
}
