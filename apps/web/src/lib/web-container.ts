import { WebContainer } from "@webcontainer/api";

let instance: WebContainer | undefined;
export async function getWebContainerInstance(): Promise<WebContainer> {
  if (!instance) instance = await WebContainer.boot();

  return instance;
}
