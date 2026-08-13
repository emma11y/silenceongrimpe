import { reqHandler } from '../dist/silenceongrimpe/server/server.mjs';

export default function handler(req, res) {
  res.setHeader('x-debug-req-url', req.url || '(empty)');
  return reqHandler(req, res);
}
