import type { PiniaPluginContext } from "pinia";
import { cloneDeep } from "lodash";

function ResetStore({ store }: PiniaPluginContext) {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(cloneDeep(initialState));
  // Note this has to be typed if you are using TS
  return { creationTime: new Date() };
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(ResetStore);
});
