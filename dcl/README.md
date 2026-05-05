# dcl response-side probes

each file is served by GH Pages with a Content-Type the wearable-preview's
loader pipeline might react to. point `contents[].url` (or any other
content-fetch field) at one of these and watch the webhook.site bin for the
labeled beacon.

webhook bin: `webhook.site/226356a4-be94-46d6-a87c-d6e063983609`

| file | served as | tests | beacon paths |
|---|---|---|---|
| probe.svg | image/svg+xml | SVG `<script>` execution — fires only if loader uses `<object>`, `<iframe>`, `<embed>`, direct nav, or `URL.createObjectURL` + non-`<img>` consumer | `/probe-svg-image-load`, `/probe-svg-script-fired` |
| probe.html | text/html | response body innerHTML'd or fetched as text and rendered | `/probe-html-img`, `/probe-html-script-fired` |
| redirect-internal.html | text/html | does loader follow redirects? does it carry credentials/origin to `peer.decentraland.org`? | `/redirect-internal-hit`, `/redirect-internal-script` |
| probe.gltf | model/gltf+json (or octet-stream) | three.js GLTFLoader parses metadata. payloads in `asset.generator`, scene/node `name`, `extras` — beacons fire only if any field is rendered via innerHTML downstream | `/probe-gltf-{generator,asset-extras,scene-name,node-name,node-extras,root-extras}` |

## reading the bin

- `*-image-load` / `*-img` — passive load; means the loader fetched and parsed
  enough to render a child image. no script execution.
- `*-script-fired` — script ran in some origin. check the `d=` JSON payload's
  `origin` and `topAccess` fields to see if it's same-origin with the preview
  iframe (= XSS) or sandboxed.
- gltf `*-extras` / `*-name` paths — only fire if the named field bubbles to
  innerHTML somewhere. that's the high-value catch.

## what GH Pages will and won't do

- `.svg` → `image/svg+xml` ✓
- `.html` → `text/html` ✓
- `.gltf` → likely `application/octet-stream` (no .gltf MIME mapping in
  GH Pages). the loader still parses by content, not header, so this is fine.
- no custom CORS, no real 30x redirects, no per-file headers. for any of those
  we'd need the local-server + ngrok path.
