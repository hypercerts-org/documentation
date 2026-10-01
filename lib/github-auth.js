const { execFileSync } = require('node:child_process');

/** Prefer explicit build credentials, then reuse a local gh login without exposing its token. */
function getGitHubToken(env = process.env, run = execFileSync) {
  for (const key of ['DOCS_SOURCE_TOKEN', 'GITHUB_TOKEN', 'GH_TOKEN']) {
    const value = env[key]?.trim();
    if (value) return value;
  }

  // CI must use its configured credentials, not an incidental runner keychain.
  if (env.CI) return '';
  try {
    return run('gh', ['auth', 'token', '--hostname', 'github.com'], {
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
      env,
    }).trim();
  } catch {
    return '';
  }
}

module.exports = { getGitHubToken };
