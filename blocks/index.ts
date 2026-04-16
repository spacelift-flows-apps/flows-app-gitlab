import { webhookSubscription } from "./webhooks/webhookSubscription.ts";
import { httpRequest } from "./request/httpRequest.ts";

export const blocks = {
  webhookSubscription,
  httpRequest,
} as const;
