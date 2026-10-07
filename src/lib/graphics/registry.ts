/**
 * Registry of build-time SVG graphics served from /graphics/<name>.svg.
 * graphicSrc() appends a content hash (?v=…) so any change to a generator busts browser caches.
 */
import { createHash } from 'node:crypto';
import { svgDoc } from './svg';
import { dotGlobe, clientGlobe } from './globes';
import { signature } from './projectArt';
import { projects } from '../../data/projects';
import { serviceArts } from './serviceArt';
import type { ServiceArt } from '../../data/home';

export const graphics: Record<string, () => string> = {
  'dot-globe': () => svgDoc(240, 240, dotGlobe(240), { title: 'Globe of dots' }),
  'client-globe': () => svgDoc(580, 540, clientGlobe(), { title: 'Globe showing Quixt clients connected to Guwahati' }),
};
for (const p of projects) {
  graphics[`product-${p.slug}`] = () => svgDoc(524, 264, signature[p.slug](524, 264, '#AB4200'), { bg: '#FDF4EF', title: `${p.name} artwork` });
  graphics[`${p.slug}-backdrop`] = () => svgDoc(1286, 720, `<g opacity="${p.caseStudy.screenshot ? 0.26 : 0.55}">${signature[p.slug](1286, 720, '#AB4200')}</g>`, { bg: '#FDF4EF', title: `${p.name} backdrop` });
}

/** Home bento art: wide services on cream, small tiles on orange. The blueprint grid is left out (the tile draws its own
 *  masked grid) and the surface colour is baked in, so the cached file looks right even before it is inlined. */
export const serviceArtSize = (art: ServiceArt) => (art === 'landing' || art === 'mvp' ? { W: 640, H: 340, dark: false } : { W: 400, H: 340, dark: true });
for (const art of Object.keys(serviceArts) as ServiceArt[]) {
  const { W, H, dark } = serviceArtSize(art);
  graphics[`service-${art}`] = () => `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 16}" height="${H + 12}" viewBox="-8 -6 ${W + 16} ${H + 12}" fill="none">` +
    serviceArts[art](W, H, dark ? '#fff' : '#AB4200').replace(/<path class="bp-grid"[^>]*\/>/, '').replaceAll('var(--art-bg,#FDF4EF)', dark ? '#AB4200' : '#FDF4EF') + '</svg>';
}

const memo = new Map<string, string>();
export const svgOf = (name: string) => { if (!memo.has(name)) memo.set(name, graphics[name]()); return memo.get(name)!; };
export const graphicSrc = (name: string) => `/graphics/${name}.svg?v=${createHash('sha1').update(svgOf(name)).digest('hex').slice(0, 10)}`;
