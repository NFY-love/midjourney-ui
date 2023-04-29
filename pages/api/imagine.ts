// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "../../interfaces";
import { Readable } from "stream";
const client = new Midjourney(
  <string>process.env.SERVER_ID,
  <string>process.env.CHANNEL_ID,
  <string>process.env.SALAI_TOKEN
);
export const config = {
  runtime: "edge",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  const encoder = new TextEncoder();
  const stream = new Readable({
    read() {},
  });
  client
    .Imagine(prompt, (uri: string) => {
      console.log("upsale.loading", uri);
      stream.push(encoder.encode(JSON.stringify({ uri })));
    })
    .then((msg) => {
      console.log("upsale.done", msg);
      stream.push(encoder.encode(JSON.stringify(msg)));
      stream.push(null);
    })
    .catch((err: ResponseError) => {
      console.log("upsale.error", err);
      stream.push(null);
    });
  stream.pipe(res);
}
