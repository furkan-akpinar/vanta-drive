import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = process.argv[2];
const destination = process.argv[3] || 'public/images';
if (!source) {
  throw new Error(
    'Usage: npm run assets:prepare -- <source-directory> [destination-directory]',
  );
}
if (path.resolve(source) === path.resolve(destination)) {
  throw new Error('Source and destination must be separate directories.');
}

const files = (await readdir(source)).filter((name) =>
  /\.(png|jpe?g)$/i.test(name),
);
if (!files.length)
  throw new Error('No PNG or JPEG images found in the source directory.');
const names = new Set();
for (const file of files) {
  const name = path.parse(file).name;
  if (names.has(name)) throw new Error(`Duplicate output name: ${name}`);
  names.add(name);
}
await mkdir(destination, { recursive: true });
for (const file of files) {
  const name = path.parse(file).name;
  for (const width of [1600, 800]) {
    const suffix = width === 800 ? '-800' : '';
    await sharp(path.join(source, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(destination, `${name}${suffix}.webp`));
  }
  console.log(file);
}
