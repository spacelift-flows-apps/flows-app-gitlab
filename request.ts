import { http } from "@slflows/sdk/v1";

export async function redirect(
  requestId: string,
  url: string,
  statusCode = 302,
) {
  await http.respond(requestId, {
    statusCode,
    headers: {
      Location: url,
    },
  });
}

export async function json(requestId: string, body: any) {
  await http.respond(requestId, {
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

export async function error(
  requestId: string,
  statusCode: number,
  message: string,
) {
  await http.respond(requestId, {
    statusCode,
    body: message,
  });
}
