import { webhookSubscription } from "./webhooks/webhookSubscription.ts";
import { pushSubscription } from "./webhooks/pushSubscription.ts";
import { issueSubscription } from "./webhooks/issueSubscription.ts";
import { mergeRequestSubscription } from "./webhooks/mergeRequestSubscription.ts";
import { noteSubscription } from "./webhooks/noteSubscription.ts";
import { pipelineSubscription } from "./webhooks/pipelineSubscription.ts";

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

import { listBranches } from "./branches/listBranches.ts";
import { createBranch } from "./branches/createBranch.ts";

import { getCommit } from "./commits/getCommit.ts";
import { listCommits } from "./commits/listCommits.ts";

import { getFileContents } from "./contents/getFileContents.ts";
import { createOrUpdateFile } from "./contents/createOrUpdateFile.ts";
import { deleteFile } from "./contents/deleteFile.ts";

import { listPipelines } from "./pipelines/listPipelines.ts";
import { getPipeline } from "./pipelines/getPipeline.ts";
import { triggerPipeline } from "./pipelines/triggerPipeline.ts";
import { retryPipeline } from "./pipelines/retryPipeline.ts";

export const blocks = {
  webhookSubscription,
  pushSubscription,
  issueSubscription,
  mergeRequestSubscription,
  noteSubscription,
  pipelineSubscription,

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

  listBranches,
  createBranch,

  getCommit,
  listCommits,

  getFileContents,
  createOrUpdateFile,
  deleteFile,

  listPipelines,
  getPipeline,
  triggerPipeline,
  retryPipeline,
} as const;
