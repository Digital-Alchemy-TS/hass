import { TServiceParams } from "@digital-alchemy/core";

export function Entities({ synapse, context }: TServiceParams) {
  synapse.switch({ context, name: "bedroom_lamp" });
  synapse.switch({ context, name: "kitchen_cabinets" });
  synapse.switch({ context, name: "living_room_mood_lights" });
  synapse.switch({ context, name: "porch_light" });
  const magicSensor = synapse.sensor({
    context,
    name: "magic",
    state: "50",
  });
  const togglesTheBinarySensor = synapse.binary_sensor({
    context,
    name: "toggles",
  });
  return { magicSensor, togglesTheBinarySensor };
}
