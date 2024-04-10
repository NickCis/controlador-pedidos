// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import http from 'node:http';
import { type Readable } from 'node:stream';
import { type NextRequest } from 'next/server';

// fix-vim-highlight = {}

function httpGet(url: string): Promise<http.IncomingMessage> {
  return new Promise<http.IncomingMessage>((rs) => {
    http.get(url, rs);
  });
}

async function* readableToIteator(readable: Readable): AsyncIterator<any> {
  for await (const r of readable) {
    yield r;
  }
}

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: AsyncIterator<any>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id || Array.isArray(id))
    return new Response('Not found', { status: 404 });

  const url = `http://static.cotodigital.com.ar/sitios/fotos/thumb/${id
    .split('-')
    .join('/')}.jpg`;

  const response = await httpGet(url);
  return new Response(iteratorToStream(readableToIteator(response)), {
    status: response.statusCode || 500,
    headers: {
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'public, immutable, max-age=604800',
    },
  });
}
