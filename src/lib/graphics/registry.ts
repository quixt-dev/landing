/**
 * Registry of build-time SVG graphics served from /graphics/<name>.svg.
 * graphicSrc() appends a content hash (?v=…) so any change to a generator busts browser caches.
 */
import { createHash } from 'node:crypto';
import { svgDoc } from './svg';
import { dotGlobe, clientGlobe } from './globes';
import { signature } from './projectArt';
import { projects } from '../../data/projects';

export const graphics: Record<string, () => string> = {
  'dot-globe': () => svgDoc(240, 240, dotGlobe(240), { title: 'Globe of dots' }),
  'client-globe': () => svgDoc(580, 540, clientGlobe(), { title: 'Globe showing Quixt clients connected to Guwahati' }),
};
for (const p of projects) {
  graphics[`product-${p.slug}`] = () => svgDoc(524, 264, signature[p.slug](524, 264, '#AB4200'), { bg: '#FDF4EF', title: `${p.name} artwork` });
  graphics[`${p.slug}-backdrop`] = () => svgDoc(1286, 720, `<g opacity="${p.caseStudy.screenshot ? 0.26 : 0.55}">${signature[p.slug](1286, 720, '#AB4200')}</g>`, { bg: '#FDF4EF', title: `${p.name} backdrop` });
}

const memo = new Map<string, string>();
export const svgOf = (name: string) => { if (!memo.has(name)) memo.set(name, graphics[name]()); return memo.get(name)!; };
export const graphicSrc = (name: string) => `/graphics/${name}.svg?v=${createHash('sha1').update(svgOf(name)).digest('hex').slice(0, 10)}`;
