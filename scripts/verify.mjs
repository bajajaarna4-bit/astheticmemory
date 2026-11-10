/**
 * Phase 1 smoke test — no test runner, no dependencies.
 *
 *   node scripts/verify.mjs            # defaults to 3001 / 4000
 *   WEB=3000 API=4000 node scripts/verify.mjs
 *
 * Exits non-zero so it can gate CI before a phase is declared done.
 */
const WEB = `http://localhost:${process.env.WEB ?? '3001'}`;
const API = `http://localhost:${process.env.API ?? '4000'}`;

const results = [];
const check = (name, passed, detail = '') => {
  results.push({ name, passed, detail });
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

async function get(url) {
  const response = await fetch(url);
  return { status: response.status, body: await response.text() };
}

const main = async () => {
  // --- API ---------------------------------------------------------------
  try {
    const meta = await get(`${API}/v1/meta`);
    check('api /v1/meta 200', meta.status === 200, `status ${meta.status}`);
    const payload = JSON.parse(meta.body);
    check('api contract has modules', Array.isArray(payload.data?.modules) && payload.data.modules.length >= 6);
    check('api contract has phase ledger', Array.isArray(payload.data?.phases) && payload.data.phases.length === 7);
  } catch (error) {
    check('api reachable', false, error.message);
  }

  try {
    const health = await get(`${API}/health`);
    check('api /health 200', health.status === 200, `status ${health.status}`);
  } catch (error) {
    check('api /health reachable', false, error.message);
  }

  try {
    const ready = await get(`${API}/health/ready`);
    // 503 is correct without Postgres; what matters is the JSON contract.
    const payload = JSON.parse(ready.body);
    check('api readiness reports checks', Boolean(payload.data?.checks), ready.status === 200 ? 'ready' : 'degraded as expected');
  } catch (error) {
    check('api /health/ready reachable', false, error.message);
  }

  // --- Web ---------------------------------------------------------------
  let html = '';
  try {
    const page = await get(`${WEB}/`);
    html = page.body;
    check('web / 200', page.status === 200, `${(page.body.length / 1024).toFixed(0)} kB`);
  } catch (error) {
    check('web reachable', false, error.message);
  }

  if (html) {
    const probes = {
      'brand wordmark': 'VELORA',
      'hero tagline': 'See it. Save it. Have it in ten',
      'hero product': 'Aura Lamp',
      'social proof stat': 'creators',
      'reduced-motion theme attribute': 'data-theme',
      'floating dock': 'Discover',
      'cart orb': 'Open cart',
      'seo description': 'name="description"',
      'structured data': 'application/ld+json',
      'web manifest': 'manifest.webmanifest',
    };
    for (const [label, needle] of Object.entries(probes)) {
      check(`web renders ${label}`, html.includes(needle));
    }

    const cssHref = html.match(/href="([^"]+\.css[^"]*)"/)?.[1];
    if (cssHref) {
      const css = await get(cssHref.startsWith('http') ? cssHref : `${WEB}${cssHref}`);
      check('css bundle served', css.status === 200, `${(css.body.length / 1024).toFixed(0)} kB`);
      check('self-hosted display font registered', css.body.includes('Space Grotesk Variable'));
      check('design tokens compiled', css.body.includes('--vl-bg'));
      check('tailwind utilities emitted', css.body.includes('.vl-glass') || css.body.includes('.backdrop-blur'));
      check('reduced-motion escape hatch', css.body.includes('prefers-reduced-motion'));
    } else {
      check('css bundle linked', false, 'no stylesheet href found');
    }
  }

  const failed = results.filter((entry) => !entry.passed);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
