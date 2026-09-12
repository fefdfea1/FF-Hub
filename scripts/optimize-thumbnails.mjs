/**
 * 작품 썸네일 자동 최적화
 * ------------------------------------------------------------------
 * thumbnails/source/ 에 캡처 이미지를 넣고 아래 명령을 실행하면
 * 카드 규격(1280×800, 16:10)에 맞춘 .webp 파일이 public/works/ 에 생긴다.
 *
 *   npm run thumbnails
 *
 * 핵심 규칙은 "내용을 자르지 않는다" 이다.
 * 캡처 비율은 화면 크기에 따라 제각각이라 카드 비율과 잘 맞지 않는데,
 * 억지로 잘라내면 로고나 문구가 날아간다. 그래서
 *
 *   1) 비율이 카드와 거의 같으면      → 그대로 채운다 (남는 몇 px 만 잘림)
 *   2) 비율이 다르면                  → 전체를 넣고 남는 자리를 색으로 메운다
 *
 * 메우는 색은 이미지 가장자리에서 뽑아내므로 덧댄 티가 거의 나지 않는다.
 * 파일 이름은 그대로 유지되고 확장자만 .webp 로 바뀌므로,
 * lib/data/works.ts 의 image 에는 `/works/<파일이름>.webp` 로 적으면 된다.
 */

import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

/** 카드 썸네일 규격. 그리드 카드가 16:10 이라 여기에 맞춘다. */
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 800;
const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT;

/**
 * 비율 차이가 이 값 이내면 잘라서 채운다.
 * 0.06 은 약 6% 로, 잘려 나가는 양이 한쪽 끝 3% 남짓이라 내용이 상하지 않는다.
 */
const CROP_TOLERANCE = 0.06;

/** 캡처 원본을 두는 곳 */
const SOURCE_DIR = 'thumbnails/source';
/** 결과물이 나오는 곳. works.ts 의 image 경로와 짝을 이룬다. */
const OUTPUT_DIR = 'public/works';

const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff']);

/**
 * 이미지 가장자리의 평균색을 구한다.
 * 남는 자리를 메울 때 쓰며, 화면 배경색과 비슷한 값이 나온다.
 */
async function edgeColor(input) {
  const image = sharp(input);
  const { width, height } = await image.metadata();
  /** 가장자리에서 이 비율만큼의 띠를 떼어 평균을 낸다. */
  const band = Math.max(1, Math.round(Math.min(width, height) * 0.04));

  const regions = [
    { left: 0, top: 0, width, height: band }, // 위
    { left: 0, top: height - band, width, height: band }, // 아래
    { left: 0, top: 0, width: band, height }, // 왼쪽
    { left: width - band, top: 0, width: band, height }, // 오른쪽
  ];

  const samples = await Promise.all(
    regions.map(async (region) => {
      const { data } = await sharp(input)
        .extract(region)
        .resize(1, 1, { fit: 'fill' })
        .raw()
        .toBuffer({ resolveWithObject: true });
      return { r: data[0], g: data[1], b: data[2] };
    }),
  );

  const average = (key) => Math.round(samples.reduce((sum, s) => sum + s[key], 0) / samples.length);
  return { r: average('r'), g: average('g'), b: average('b') };
}

/** 파일 하나를 카드 규격에 맞춰 내보낸다. */
async function optimize(sourcePath, outputPath) {
  const { width, height } = await sharp(sourcePath).metadata();
  const ratio = width / height;
  const difference = Math.abs(ratio - TARGET_RATIO) / TARGET_RATIO;

  const pipeline = sharp(sourcePath);
  let mode;

  if (difference <= CROP_TOLERANCE) {
    /* 카드와 비율이 거의 같다 — 위쪽을 기준으로 채운다. */
    mode = 'cover';
    pipeline.resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'top' });
  } else {
    /* 비율이 다르다 — 전체를 넣고 남는 자리는 가장자리 색으로 메운다. */
    mode = 'contain';
    const background = await edgeColor(sourcePath);
    pipeline.resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: 'contain',
      background: { ...background, alpha: 1 },
    });
  }

  const info = await pipeline.webp({ quality: 82 }).toFile(outputPath);
  return { mode, source: `${width}×${height}`, ratio: ratio.toFixed(2), bytes: info.size };
}

async function main() {
  let entries;
  try {
    entries = await readdir(SOURCE_DIR);
  } catch {
    console.error(`원본 폴더가 없습니다: ${SOURCE_DIR}`);
    console.error('캡처 이미지를 이 폴더에 넣고 다시 실행해 주세요.');
    process.exitCode = 1;
    return;
  }

  const files = entries.filter((name) => SUPPORTED.has(path.extname(name).toLowerCase()));
  if (files.length === 0) {
    console.log(`${SOURCE_DIR} 에 변환할 이미지가 없습니다.`);
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`규격 ${TARGET_WIDTH}×${TARGET_HEIGHT} (16:10) 로 맞춥니다.\n`);

  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, file);
    if (!(await stat(sourcePath)).isFile()) continue;

    const name = path.basename(file, path.extname(file));
    const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);
    const result = await optimize(sourcePath, outputPath);

    const note = result.mode === 'cover' ? '채움' : '전체 보존 + 여백';
    console.log(
      `  ${file}  ${result.source} (${result.ratio}:1) → ${name}.webp  ` +
        `${note}  ${(result.bytes / 1024).toFixed(0)}KB`,
    );
  }

  console.log(`\n완료. lib/data/works.ts 의 image 에 "/works/<파일이름>.webp" 로 적어 주세요.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
