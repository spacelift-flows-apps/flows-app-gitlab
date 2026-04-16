import { webhookSubscription } from "./webhooks/webhookSubscription.ts";
import { httpRequest } from "./request/httpRequest.ts";

import { listIssues } from "./issues/listIssues.ts";
import { getIssue } from "./issues/getIssue.ts";
import { createIssue } from "./issues/createIssue.ts";
import { updateIssue } from "./issues/updateIssue.ts";
import { createIssueNote } from "./issues/createIssueNote.ts";
import { updateIssueNote } from "./issues/updateIssueNote.ts";
import { deleteIssueNote } from "./issues/deleteIssueNote.ts";

import { listMergeRequests } from "./mergeRequests/listMergeRequests.ts";
import { getMergeRequest } from "./mergeRequests/getMergeRequest.ts";
import { createMergeRequest } from "./mergeRequests/createMergeRequest.ts";
import { updateMergeRequest } from "./mergeRequests/updateMergeRequest.ts";
import { mergeMergeRequest } from "./mergeRequests/mergeMergeRequest.ts";
import { getMergeRequestChanges } from "./mergeRequests/getMergeRequestChanges.ts";
import { createMergeRequestNote } from "./mergeRequests/createMergeRequestNote.ts";
import { approveMergeRequest } from "./mergeRequests/approveMergeRequest.ts";

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

  listMergeRequests,
  getMergeRequest,
  createMergeRequest,
  updateMergeRequest,
  mergeMergeRequest,
  getMergeRequestChanges,
  createMergeRequestNote,
  approveMergeRequest,
} as const;
