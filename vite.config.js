import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Mirrors calibrator's JSX generation logic (server-side string building) ──
function _zoneCentroid(z) {
    if (z.labelX !== undefined) return { lx: z.labelX, ly: z.labelY }
    if (z.type === 'rect') return { lx: z.x + z.w / 2, ly: z.y + z.h / 2 }
    if (z.type === 'circle') return { lx: z.cx, ly: z.cy }
    if (z.type === 'poly') {
        const n = z.points.length
        return { lx: z.points.reduce((a, p) => a + p.x, 0) / n, ly: z.points.reduce((a, p) => a + p.y, 0) / n }
    }
    if (z.type === 'multi') {
        const cs = z.shapes.map(s => _zoneCentroid(s))
        return { lx: cs.reduce((a, c) => a + c.lx, 0) / cs.length, ly: cs.reduce((a, c) => a + c.ly, 0) / cs.length }
    }
    return { lx: 0, ly: 0 }
}

function _primitiveToJSX(s) {
    if (s.type === 'rect') return `<rect className="f" x={${s.x}} y={${s.y}} width={${s.w}} height={${s.h}} />`
    if (s.type === 'circle') return `<circle className="f" cx={${s.cx}} cy={${s.cy}} r={${s.r}} />`
    if (s.type === 'poly') return `<polygon className="f" points="${s.points.map(p => `${p.x},${p.y}`).join(' ')}" />`
    return ''
}

function buildZonesJSX(zones, doors) {
    const I = '            '   // 12-space indent (matches SVG children indent)
    const I2 = I + '    '      // 16-space indent (matches <g> children indent)

    function zoneToJSX(z) {
        const { lx, ly } = _zoneCentroid(z)
        const lblX = Math.round(lx), lblY = Math.round(ly)
        const linesStr = JSON.stringify(z.lines && z.lines.length ? z.lines : [z.id])
        const shapeEls = z.type === 'multi'
            ? z.shapes.map(s => `${I2}${_primitiveToJSX(s)}`).join('\n')
            : `${I2}${_primitiveToJSX(z)}`
        return (
            `${I}{/* ── ${z.id} ── */}\n` +
            `${I}<g id="room-${z.id}" className={cls('${z.id}')} onClick={clk('${z.id}')}>\n` +
            `${shapeEls}\n` +
            `${I2}<Lbl x={${lblX}} y={${lblY}} lines={${linesStr}} />\n` +
            `${I}</g>`
        )
    }

    function doorToJSX(d) {
        return (
            `${I}<g id="blastdoor-${d.id}" style={{ pointerEvents: 'none' }}>\n` +
            `${I2}<rect x={${d.x}} y={${d.y}} width={${d.w}} height={${d.h}} fill="rgba(233,69,96,0.22)" stroke="#e94560" strokeWidth={1.5} />\n` +
            `${I2}<line x1={${d.x}} y1={${d.y}} x2={${d.x + d.w}} y2={${d.y + d.h}} stroke="rgba(233,69,96,0.45)" strokeWidth={1} />\n` +
            `${I2}<line x1={${d.x + d.w}} y1={${d.y}} x2={${d.x}} y2={${d.y + d.h}} stroke="rgba(233,69,96,0.45)" strokeWidth={1} />\n` +
            `${I}</g>`
        )
    }

    const parts = zones.map(zoneToJSX)
    if (doors.length > 0) {
        parts.push(`\n${I}{/* ════ BLAST DOORS ════ */}`)
        parts.push(...doors.map(doorToJSX))
    }
    return parts.join('\n\n')
}

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'copy-htaccess',
            closeBundle() {
                try {
                    copyFileSync(
                        resolve(__dirname, 'public/.htaccess'),
                        resolve(__dirname, 'dist/.htaccess')
                    )
                } catch {/* already copied */ }
            },
        },
        {
            name: 'apply-zones',
            configureServer(server) {
                server.middlewares.use('/api/apply-zones', async (req, res) => {
                    res.setHeader('Content-Type', 'application/json')

                    if (req.method !== 'POST') {
                        res.statusCode = 405
                        res.end(JSON.stringify({ error: 'Method Not Allowed' }))
                        return
                    }

                    // Collect body
                    let body = ''
                    for await (const chunk of req) body += chunk

                    let data
                    try { data = JSON.parse(body) } catch {
                        res.statusCode = 400
                        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
                        return
                    }

                    const { level, zones = [], doors = [] } = data
                    if (level !== 28 && level !== 27) {
                        res.statusCode = 400
                        res.end(JSON.stringify({ error: 'Level must be 27 or 28' }))
                        return
                    }

                    const targetFile = resolve(__dirname, `src/components/stargate/Level${level}Plan.jsx`)
                    const bakFile = targetFile + '.bak'

                    let src
                    try { src = readFileSync(targetFile, 'utf8') } catch {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: `Cannot read Level${level}Plan.jsx` }))
                        return
                    }

                    // Backup before any modification
                    writeFileSync(bakFile, src, 'utf8')

                    // Find sentinel markers
                    const START = '{/* @@ZONES_START@@ */}'
                    const END = '{/* @@ZONES_END@@ */}'
                    const si = src.indexOf(START)
                    const ei = src.indexOf(END)

                    if (si === -1 || ei === -1) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: 'Sentinel markers not found — did you add @@ZONES_START@@ / @@ZONES_END@@ to the plan file?' }))
                        return
                    }

                    const zonesJSX = buildZonesJSX(zones, doors)
                    const newSrc =
                        src.slice(0, si + START.length) +
                        '\n' + zonesJSX + '\n\n            ' +
                        src.slice(ei)

                    try {
                        writeFileSync(targetFile, newSrc, 'utf8')
                    } catch {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: `Failed to write Level${level}Plan.jsx` }))
                        return
                    }

                    res.end(JSON.stringify({ ok: true, level, zones: zones.length, doors: doors.length }))
                })
            },
        },
    ],
})
