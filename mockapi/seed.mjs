// Upload seed JSON to MockAPI.
// Usage: node mockapi/seed.mjs https://<project-id>.mockapi.io/api/v1
// Requires resources "team" and "projects" to exist (empty) in MockAPI first.
// Members are stored inside the single "team" item (team.members).

import { readFile } from 'node:fs/promises'

const baseUrl = (process.argv[2] || '').replace(/\/+$/, '')
if (!baseUrl.startsWith('https://')) {
  console.error('Usage: node mockapi/seed.mjs https://<project-id>.mockapi.io/api/v1')
  process.exit(1)
}

const resources = ['team', 'projects']

for (const resource of resources) {
  const file = new URL(`./${resource}.json`, import.meta.url)
  const items = JSON.parse(await readFile(file, 'utf8'))

  for (const item of items) {
    const res = await fetch(`${baseUrl}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      console.error(`Failed POST /${resource}: ${res.status} ${await res.text()}`)
      process.exit(1)
    }
    const created = await res.json()
    console.log(`/${resource} -> id ${created.id} (${item.name || item.title})`)
  }
}

console.log('Seed selesai.')
