import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createHash } from "crypto";

const srcPath = "QuizPrototype.jsx";
let src = readFileSync(srcPath, "utf8");
mkdirSync("public/images", { recursive: true });

const seen = new Map(); // dataUrl -> path
const assets = [];

function ensureAsset(dataUrl, kind) {
  if (seen.has(dataUrl)) return seen.get(dataUrl);
  const match = /^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/s.exec(dataUrl);
  if (!match) throw new Error("bad data url");
  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const hash = createHash("sha1").update(match[2]).digest("hex").slice(0, 10);
  const name = `${kind}-${hash}.${ext}`;
  const buf = Buffer.from(match[2], "base64");
  writeFileSync(`public/images/${name}`, buf);
  const path = `/images/${name}`;
  seen.set(dataUrl, path);
  assets.push({ path, bytes: buf.length, kind });
  console.log(name, buf.length);
  return path;
}

src = src.replace(/url\('(data:image\/(?:jpeg|jpg|png|webp|gif);base64,[^']+)'\)/g, (_, dataUrl) => {
  return `url('${ensureAsset(dataUrl, "bg")}')`;
});

src = src.replace(/src="(data:image\/(?:jpeg|jpg|png|webp|gif);base64,[^"]+)"/g, (_, dataUrl) => {
  return `src="${ensureAsset(dataUrl, "asset")}"`;
});

if (/data:image\//.test(src)) {
  const left = (src.match(/data:image\//g) || []).length;
  console.warn("warning: remaining data:image refs:", left);
}

writeFileSync(srcPath, src);
writeFileSync("scripts/image-extract-map.json", JSON.stringify(assets, null, 2));
console.log(`unique assets: ${assets.length}`);
console.log(`QuizPrototype bytes: ${src.length}`);
