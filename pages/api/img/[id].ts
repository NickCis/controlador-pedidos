// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';

const httpGet = (url: string) => {
  return new Promise<http.IncomingMessage>((rs) => {
    http.get(url, rs);
  });
};

// http://static.cotodigital.com.ar/sitios/fotos/thumb/00531000/00531077.jpg
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(404);
    return;
  }
  const url = `http://static.cotodigital.com.ar/sitios/fotos/thumb/${id
    .split('-')
    .join('/')}.jpg`;

  const response = await httpGet(url);
  res.status(response.statusCode || 500);
  res.setHeader(
    'Content-Type',
    response.headers['content-type'] || 'image/jpeg',
  );
  res.setHeader('Cache-Control', 'public, max-age=604800');
  response.pipe(res);
}
