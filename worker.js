// Cloudflare Worker: keeps your Anthropic API key off the website.
export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN || '*';

    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    if (req.method !== 'POST') {
      return new Response('POST only', {
        status: 405,
        headers: cors
      });
    }

    if (
      env.ALLOWED_ORIGIN &&
      req.headers.get('Origin') !== env.ALLOWED_ORIGIN
    ) {
      return new Response('Forbidden', {
        status: 403,
        headers: cors
      });
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON request.'
        }),
        {
          status: 400,
          headers: {
            ...cors,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { prompt, quick } = body || {};

    if (
      typeof prompt !== 'string' ||
      !prompt.trim() ||
      prompt.length > 60000
    ) {
      return new Response(
        JSON.stringify({
          error: 'Bad request: prompt is missing or too long.'
        }),
        {
          status: 400,
          headers: {
            ...cors,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'ANTHROPIC_API_KEY is not configured on the Worker.'
        }),
        {
          status: 500,
          headers: {
            ...cors,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    try {
      const r = await fetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',

          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },

          body: JSON.stringify({
            model: quick
              ? 'claude-haiku-5-5'
              : 'claude-sonnet-5-5',

            max_tokens: quick ? 1000 : 12000,

            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        }
      );

      const j = await r.json().catch(() => ({}));

      const text = (j.content || [])
        .filter(c => c && c.type === 'text')
        .map(c => c.text || '')
        .join('');

      if (!r.ok) {
        const detail =
          (j.error && j.error.message) ||
          `Anthropic API error (HTTP ${r.status}).`;

        return new Response(
          JSON.stringify({
            error: detail
          }),
          {
            status: 502,
            headers: {
              ...cors,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (!text.trim()) {
        return new Response(
          JSON.stringify({
            error: 'Anthropic returned no text.'
          }),
          {
            status: 502,
            headers: {
              ...cors,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return new Response(
        JSON.stringify({
          text
        }),
        {
          status: 200,
          headers: {
            ...cors,
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (e) {
      return new Response(
        JSON.stringify({
          error:
            'Could not reach Anthropic: ' +
            (e && e.message ? e.message : String(e))
        }),
        {
          status: 502,
          headers: {
            ...cors,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
};
