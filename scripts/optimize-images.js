import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = join(import.meta.dirname, '..', 'src', 'assets')
const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'images')

// 排除非项目图片
const EXCLUDE_PREFIXES = ['hero', 'section', 'show']

function isProjectImage(filename) {
  const ext = extname(filename).toLowerCase()
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') return false
  const name = basename(filename, ext)
  return EXCLUDE_PREFIXES.every(prefix => !name.startsWith(prefix))
}

function getStem(filename) {
  return basename(filename, extname(filename))
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const files = readdirSync(ASSETS_DIR).filter(isProjectImage)
  const manifest = {}

  for (const file of files) {
    const stem = getStem(file)
    const srcPath = join(ASSETS_DIR, file)
    const srcMtime = statSync(srcPath).mtimeMs

    const out640 = join(OUTPUT_DIR, `${stem}-640w.webp`)
    const out1280 = join(OUTPUT_DIR, `${stem}-1280w.webp`)
    const outLqip = join(OUTPUT_DIR, `${stem}-lqip.webp`)

    // 跳过未变化的文件
    try {
      const existingMtime = statSync(out640).mtimeMs
      if (existingMtime >= srcMtime) {
        const lqipBuffer = readFileSync(outLqip)
        manifest[stem] = {
          srcset: `/images/${stem}-640w.webp 640w, /images/${stem}-1280w.webp 1280w`,
          sizes: '(max-width: 768px) 640px, 1280px',
          placeholder: `data:image/webp;base64,${lqipBuffer.toString('base64')}`,
          width: 1280,
          height: 720
        }
        console.log(`  skip: ${stem} (unchanged)`)
        continue
      }
    } catch {}

    console.log(`  processing: ${stem}`)

    // 生成 LQIP（40px 缩略图，quality 60% 兼顾清晰度与体积）
    const lqipBuffer = await sharp(srcPath)
      .resize(40)
      .webp({ quality: 60 })
      .toBuffer()
    writeFileSync(outLqip, lqipBuffer)

    // 生成 640w
    await sharp(srcPath)
      .resize(640)
      .webp({ quality: 75 })
      .toFile(out640)

    // 生成 1280w
    await sharp(srcPath)
      .resize(1280)
      .webp({ quality: 80 })
      .toFile(out1280)

    manifest[stem] = {
      srcset: `/images/${stem}-640w.webp 640w, /images/${stem}-1280w.webp 1280w`,
      sizes: '(max-width: 768px) 640px, 1280px',
      placeholder: `data:image/webp;base64,${lqipBuffer.toString('base64')}`,
      width: 1280,
      height: 720
    }
  }

  writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`  done: ${files.length} images processed`)
}

main().catch(err => {
  console.error('Image optimization failed:', err)
  process.exit(1)
})