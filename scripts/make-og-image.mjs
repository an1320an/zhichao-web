import sharp from 'sharp'
import path from 'node:path'

const publicDir = path.resolve(import.meta.dirname, '../public')
const mascotPath = path.join(publicDir, 'mascot/happy.webp')
const mascotPngBuffer = await sharp(mascotPath).png().toBuffer()
const mascotBase64 = mascotPngBuffer.toString('base64')

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff" />
  <circle cx="1020" cy="120" r="260" fill="#aa3bff" opacity="0.08" />
  <circle cx="120" cy="560" r="220" fill="#aa3bff" opacity="0.06" />
  <image x="820" y="165" width="300" height="300" href="data:image/png;base64,${mascotBase64}" />
  <text x="100" y="260" font-family="system-ui, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="600" fill="#08060d">槐序 · 知潮</text>
  <text x="100" y="330" font-family="system-ui, 'Segoe UI', Roboto, sans-serif" font-size="34" fill="#6b6375">一个会陪着医学人成长的 AI 小伙伴</text>
  <text x="100" y="390" font-family="system-ui, 'Segoe UI', Roboto, sans-serif" font-size="26" fill="#aa3bff">huaix.cn</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile(path.join(publicDir, 'og-image.png'))
console.log('og-image.png generated')
