/**
 * Registry of product-relevant blueprint graphics. Every function is (W, H, colour) → SVG body, so the
 * same motif renders as a project card (524×264), a hero backdrop (1286×720) or a bento tile.
 */
import type { ModuleArt, ProjectSlug } from '../../data/projects';
import type { Art } from './blueprint';
import { tessaSignature, scrape, waterfall, artboards, diff, usage } from './tessaArt';
import { nandySignature, reconcileFlow, trace, receipt, gatePass, rls } from './nandyArt';
import { flowgenticSignature, compileView, skillDef, ragPipe, sequence, sseStream } from './flowgenticArt';
import { infinifySignature, loaderStrip, marqueeSpec, pinSpec, chipSpec, perfSpec } from './infinifyArt';

export const moduleArts: Record<ModuleArt, Art> = {
  scrape, waterfall, artboards, diff, usage,
  reconcile: reconcileFlow, assistant: trace, ledger: receipt, qr: gatePass, layers: rls,
  tree: compileView, plugs: skillDef, vectors: ragPipe, approve: sequence, stream: sseStream,
  lemniscate: loaderStrip, marquee: marqueeSpec, words: pinSpec, revenue: chipSpec, gauge: perfSpec,
};
/** Signature motif per project (cards, hero backdrops, OG images). */
export const signature: Record<ProjectSlug, Art> = { tessa: tessaSignature, nandy: nandySignature, flowgentic: flowgenticSignature, infinify: infinifySignature };
