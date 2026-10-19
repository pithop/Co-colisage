import { useMemo } from 'react';
import QRCode from 'qrcode';
// ISO/IEC 15417 Code 128, subset C: numeric pairs, modulo-103 checksum, stop symbol.
const patterns = '212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'.split(' ');
export function DocumentBarcode({ digest }: { digest: string }) {
  const digits = BigInt(`0x${digest.slice(0, 12)}`).toString().padStart(16, '0');
  const codes = [105, ...digits.match(/../g)!.map(Number)];
  codes.push(codes.reduce((sum, code, i) => sum + code * (i || 1), 0) % 103, 106);
  let x = 12;
  const bars: { x: number; width: number }[] = [];
  codes.forEach(code => [...patterns[code]].forEach((width, i) => { if (i % 2 === 0) bars.push({ x, width: +width }); x += +width; }));
  return <svg viewBox={`0 0 ${x + 12} 54`} role="img" aria-label={`Code-barres du bordereau ${digits}`}><rect width="100%" height="100%" fill="white" />{bars.map(bar => <rect key={bar.x} x={bar.x} y="4" width={bar.width} height="34" fill="#0a1128" />)}<text x={(x + 12) / 2} y="49" textAnchor="middle" fontSize="8" fontFamily="monospace">{digits}</text></svg>;
}
export function DocumentQr({ id, digest }: { id: string; digest: string }) {
  const matrix = useMemo(() => QRCode.create(JSON.stringify({ issuer: 'BagVoyage', document: id, sha256: digest }), { errorCorrectionLevel: 'M' }).modules, [id, digest]);
  const path = Array.from(matrix.data).flatMap((v, i) => v ? [`M${i % matrix.size + 4} ${Math.floor(i / matrix.size) + 4}h1v1h-1z`] : []).join('');
  return <svg viewBox={`0 0 ${matrix.size + 8} ${matrix.size + 8}`} role="img" aria-label="QR code de référence du document" shapeRendering="crispEdges"><rect width="100%" height="100%" fill="white" /><path d={path} fill="#0a1128" /></svg>;
}
