import {
  eachSeries,
  InternalError,
  TServiceParams,
} from "@digital-alchemy/core";

import { TAreaId } from "../dynamic";
import {
  AREA_REGISTRY_UPDATED,
  AreaCreate,
  AreaDetails,
  EARLY_ON_READY,
  ENTITY_REGISTRY_UPDATED,
  PICK_ENTITY,
} from "../helpers";

export function Area({
  hass,
  context,
  config,
  logger,
  event,
  lifecycle,
}: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    let loading = new Promise<void>(async done => {
      hass.area.current = await hass.area.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
    hass.socket.subscribe({
      context,
      event_type: "area_registry_updated",
      async exec() {
        hass.area.current = await hass.area.list();
        logger.debug(`area registry updated`);
        event.emit(AREA_REGISTRY_UPDATED);
      },
    });
  });

  return {
    async apply(area: TAreaId, entities: PICK_ENTITY[]) {
      const out = { updated: [] as PICK_ENTITY[] };
      await eachSeries(entities, async (entity: PICK_ENTITY) => {
        const details = hass.entity.registry.current.find(
          item => item.entity_id === entity,
        );
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
    },
    async create(details: AreaCreate) {
      return await new Promise<void>(async done => {
        event.once(AREA_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          type: "config/area_registry/create",
          ...details,
        });
      });
    },
    current: [] as AreaDetails[],
    async delete(area_id: TAreaId) {
      return await new Promise<void>(async done => {
        event.once(AREA_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          area_id,
          type: "config/area_registry/delete",
        });
      });
    },
    async list() {
      return await hass.socket.sendMessage<AreaDetails[]>({
        type: "config/area_registry/list",
      });
    },
    async update(details: AreaDetails) {
      return await new Promise<void>(async done => {
        event.once(AREA_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          type: "config/area_registry/update",
          ...details,
        });
      });
    },
  };
}
