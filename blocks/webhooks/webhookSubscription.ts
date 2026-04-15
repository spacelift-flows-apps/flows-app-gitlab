import { events } from "@slflows/sdk/v1";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";

export const webhookSubscription = defineGitLabBlock({
  name: "On Webhook",
  description:
    "Subscribes to all GitLab webhook events. Use this as an escape hatch to receive any webhook event, including those not covered by dedicated subscription blocks.",
  category: "Webhooks",
  entrypoint: true,
  outputJsonSchema: {
    type: "object",
    properties: {
      eventType: {
        type: "string",
        description:
          "The GitLab webhook event type (e.g., 'Push Hook', 'Issue Hook', 'Merge Request Hook', 'Pipeline Hook')",
      },
      payload: {
        type: "object",
        additionalProperties: true,
        description:
          "The full webhook event payload with keys converted to camelCase",
      },
    },
    required: ["eventType", "payload"],
    additionalProperties: false,
  },
  staticConfig: {
    project: {
      name: "Project",
      description:
        "Filter by project path (e.g., 'my-group/my-project'). Leave empty for all projects.",
      type: "string",
      required: false,
    },
    eventType: {
      name: "Event Type",
      description:
        "Filter by GitLab event type (e.g., 'Push Hook', 'Issue Hook', 'Merge Request Hook'). Leave empty for all events.",
      type: "string",
      required: false,
    },
  },
  onInternalMessage: async (input) => {
    const payload = input.message.body.payload;
    const eventType = input.message.body.eventType as string;
    const { project, eventType: filterEventType } = input.block.config;

    if (filterEventType && eventType !== filterEventType) {
      return;
    }

    if (project && payload.project?.path_with_namespace !== project) {
      return;
    }

    await events.emit({
      eventType,
      payload: convertKeysToCamelCase(payload) as Record<string, unknown>,
    });
  },
});
