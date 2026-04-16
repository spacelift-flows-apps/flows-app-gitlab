import { webhookSubscription } from "./webhooks/webhookSubscription.ts";
import { httpRequest } from "./request/httpRequest.ts";

import { listIssues } from "./issues/listIssues.ts";
import { getIssue } from "./issues/getIssue.ts";
import { createIssue } from "./issues/createIssue.ts";
import { updateIssue } from "./issues/updateIssue.ts";
import { createIssueNote } from "./issues/createIssueNote.ts";
import { updateIssueNote } from "./issues/updateIssueNote.ts";
import { deleteIssueNote } from "./issues/deleteIssueNote.ts";

export const blocks = {
  webhookSubscription,
  httpRequest,

  listIssues,
  getIssue,
  createIssue,
  updateIssue,
  createIssueNote,
  updateIssueNote,
  deleteIssueNote,
} as const;
