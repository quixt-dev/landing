/**
 * Real Quixt projects. Facts are taken from each codebase / git history — no invented
 * outcome metrics. Dashboard mock-ups use illustrative sample data inside real UI layouts.
 */
export type ProjectSlug = 'tessa' | 'nandy' | 'flowgentic' | 'infinify';
export type ModuleArt =
  | 'scrape' | 'waterfall' | 'artboards' | 'diff' | 'usage'
  | 'reconcile' | 'assistant' | 'ledger' | 'qr' | 'layers'
  | 'tree' | 'plugs' | 'vectors' | 'approve' | 'stream'
  | 'lemniscate' | 'marquee' | 'words' | 'revenue' | 'gauge';

export interface CaseStudy {
  caseNo: string;
  published: string; // first commit (ISO)
  updated: string;   // last commit (ISO)
  status: string;
  liveUrl?: string;
  repoUrl?: string;
  intro: string;
  client: string;
  role: string;
  appCategory: string;
  specs: { label: string; value: string }[];
  facts: { value: string; label: string; note: string }[];
  overviewTitle: string;
  narrative: { title: string; text: string }[];
  modulesTitle: string;
  modulesLead: string;
  modules: { title: string; text: string; tags: string[]; art: ModuleArt; dark?: boolean; wide?: boolean }[];
  architecture: {
    title: string;
    summary: string;
    stats: string;
    columns: { label: string; nodes: { title: string; sub: string; highlight?: boolean }[] }[];
    /** service index → data index, async? */
    links: [number, number, boolean][];
  };
  stack: { group: string; items: string[] }[];
  stackLead: string;
  code: { file: string; secondaryFile: string; language: 'TypeScript' | 'Python' | 'TSX'; source: string; highlightLine: number; command: string; commandResult: string };
  credits?: string;
  /** Google PageSpeed / Lighthouse scores for the live product (supplied by the client). */
  pagespeed?: { performance: number; accessibility: number; bestPractices: number; seo: number };
  /** Open-source details (license panel + quickstart). */
  openSource?: { license: string; repo: string; quickstart: string[]; highlights: { value: string; label: string }[] };
  dashboardLabel: string;
  /** Real product screenshot (file in src/assets/images/projects) — used instead of the SVG recreation. */
  screenshot?: string;
}

export interface Project {
  slug: ProjectSlug;
  name: string;
  category: string;
  categoryShort: string;
  year: string;
  duration: string;
  summary: string;
  caseStudy: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: 'tessa', name: 'Tessa', category: 'AI Marketing Platform', categoryShort: 'AI Campaign\nEngine', year: '2026', duration: '8 Weeks',
    summary: 'An AI Marketing Platform That Learns A Brand From Its Website And Turns One Brief Into Launch-Ready Ads For Every Channel.',
    caseStudy: {
      caseNo: '01', published: '2026-02-14', updated: '2026-04-07', status: 'Live · tessa.so', liveUrl: 'https://tessa.so',
      intro: 'An AI Marketing Platform That Learns A Brand From Its Website, Builds A Reusable Brand DNA, And Turns One Brief Into On-Brand Ad Creatives For Every Channel, In Minutes.',
      client: 'Tessa', role: 'Product Design & Full-Stack Engineering', appCategory: 'BusinessApplication',
      specs: [
        { label: 'Product', value: 'Tessa' }, { label: 'Category', value: 'AI MarTech' }, { label: 'Timeline', value: '8 Weeks · 2026' },
        { label: 'Scope', value: 'Design + Full-Stack' }, { label: 'Platforms', value: 'Web App · API' },
      ],
      facts: [
        { value: '29', label: 'Ad Themes', note: 'Product Hero To UGC Style' },
        { value: '6', label: 'Creative Formats', note: 'IG · FB · X · LinkedIn · Hero' },
        { value: '4', label: 'Worker Queues', note: 'Brand · Campaign · GPU · Default' },
        { value: '132', label: 'Commits', note: 'Feb → Apr 2026' },
      ],
      overviewTitle: 'From One Brief\nTo Every Format',
      narrative: [
        { title: 'The Challenge', text: 'Brand Inputs Live Everywhere: Websites, Decks, Drives. Producing On-Brand Creative For Every Social Format Took Marketing Teams Days Of Back-And-Forth.' },
        { title: 'Our Approach', text: 'We Scrape The Site Into A Structured Brand DNA, Then Fan One Brief Out To Queued Gemini Workers That Write Copy, Pick Ad Themes And Render Each Format.' },
        { title: 'The Outcome', text: 'Marketers Go From A URL To A Library Of Brand-Consistent Ads, Then Refine Any Creative By Chat Or AI Image Edits, Metered By Simple Credits.' },
      ],
      modulesTitle: 'Five Engines,\nOne Brand DNA',
      modulesLead: 'Every Generation Reads From The Same Brand Profile, So Copy, Layout And Imagery Stay On-Brand Across Channels.',
      modules: [
        { title: 'Brand DNA Extraction', text: 'BrowserBase Screenshots And Gemini Vision Distil Voice, Visuals, Logo And Products Into A Reusable Profile, Exportable As A Brand PDF.', tags: ['BrowserBase', 'Playwright', 'Gemini Vision'], art: 'scrape', dark: true, wide: true },
        { title: 'Campaign Engine', text: 'One Brief Fans Out To Every Selected Format, With Copy, Theme And Layout Chosen Per Channel.', tags: ['Celery', 'Prompt Engine'], art: 'waterfall' },
        { title: '29 Ad Themes', text: 'From Product Hero And Social Proof To UGC And Meme-Style Layouts, Parsed Into Renderable Templates.', tags: ['Ad Themes', 'Layout Parser'], art: 'artboards' },
        { title: 'Chat & Image Editing', text: 'Refine Any Creative In Conversation Or Edit Imagery With AI, Every Change Kept In The Campaign Thread.', tags: ['Gemini Image', 'Edit Chat'], art: 'diff' },
        { title: 'Credits & Billing', text: 'Usage-Based Credits For Scrapes, Formats And Edits, With Checkout, Webhooks And Product Analytics.', tags: ['Dodo Payments', 'PostHog'], art: 'usage', dark: true },
      ],
      architecture: {
        title: 'Queue Everything,\nPoll The Result',
        summary: 'A FastAPI Core Hands Every Heavy Job To Celery Workers. Clients Poll Task Status While Gemini, BrowserBase And The Renderer Do The Work.',
        stats: '~50 Endpoints · 4 Queues · AWS ECS Fargate',
        columns: [
          { label: 'Clients', nodes: [{ title: 'Dashboard', sub: 'Next.js 16 · React 19' }, { title: 'Onboarding', sub: 'Brand Setup Flow' }, { title: 'Public API', sub: 'Per-User API Keys' }] },
          { label: 'Edge', nodes: [{ title: 'FastAPI', sub: '~50 Routes · Rate Limits', highlight: true }, { title: 'Auth', sub: 'Clerk · RLS Context' }] },
          { label: 'Services', nodes: [{ title: 'Brand Workflow', sub: 'Scrape · Vision · PDF' }, { title: 'Campaign Workflow', sub: 'Prompt · Copy · Themes' }, { title: 'Render Service', sub: 'Layouts · CairoSVG' }, { title: 'Product Catalog', sub: 'Pages · Reviews' }, { title: 'Celery Workers', sub: 'Brand · Campaign · GPU' }] },
          { label: 'Data', nodes: [{ title: 'PostgreSQL 16', sub: '14 Tables · RLS' }, { title: 'Redis 7', sub: 'Broker · Cache' }, { title: 'Amazon S3', sub: 'Assets · Logos' }, { title: 'Gemini', sub: 'Text · Vision · Image' }] },
        ],
        links: [[0, 0, false], [1, 0, false], [3, 0, false], [2, 2, false], [0, 2, false], [4, 1, true], [1, 3, true]],
      },
      stackLead: 'A Typed Next.js Front End Over A Python Pipeline, Picked So The GPU-Heavy Work Can Scale Independently Of The API.',
      stack: [
        { group: 'Frontend', items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4'] },
        { group: 'Growth', items: ['Clerk', 'PostHog', 'Dodo Payments'] },
        { group: 'Backend', items: ['FastAPI', 'Python 3.12', 'Celery', 'Pydantic v2'] },
        { group: 'Data', items: ['PostgreSQL 16', 'SQLAlchemy 2', 'Redis 7', 'Amazon S3'] },
        { group: 'AI', items: ['Gemini 3 Flash', 'Gemini 3 Pro Image', 'BrowserBase', 'Playwright'] },
        { group: 'Infra', items: ['AWS ECS Fargate', 'RDS', 'Docker', 'GitHub Actions'] },
      ],
      code: {
        file: 'campaign_workflow.py', secondaryFile: 'ad_themes.py', language: 'Python', highlightLine: 15,
        command: '$ celery -A worker worker -Q campaign,gpu', commandResult: '→ campaign + gpu queues consuming',
        source: `    async def generate_campaign(
        user_id: str,
        creative_types: List[str],
        brief: str,
        brand_dna: Optional[Dict] = None,
        user_prompt: Optional[str] = None,
        dna_id: Optional[str] = None,
        selected_image_urls: Optional[List[str]] = None,
        selected_product_context: Optional[Dict[str, Any]] = None,
        layout_options: Optional[Dict[str, Any]] = None,
        brand_owner_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Runs the multi-asset marketing campaign generation pipeline."""
        # Whoever owns the brand is the lookup owner; default to caller
        effective_brand_owner = brand_owner_id or user_id
        agent = MarketingAgent(user_id=user_id)

        async with AsyncSessionLocal() as db:
            await set_rls_context(db, user_id)`,
      },
      pagespeed: { performance: 96, accessibility: 100, bestPractices: 100, seo: 100 },
      dashboardLabel: 'Tessa home dashboard with creative stats, recent ads and recent campaigns',
      screenshot: 'tessa-dashboard.png',
    },
  },
  {
    slug: 'nandy', name: 'NandyAI', category: 'AI Society Management', categoryShort: 'AI-Native\nPropTech', year: '2026', duration: '5 Weeks',
    summary: 'An AI-Native Operating System For Housing Societies: Dues, Payments, Complaints And The Gate, With AI Bank Reconciliation.',
    caseStudy: {
      caseNo: '02', published: '2026-06-13', updated: '2026-07-13', status: 'Live · nandyai.com', liveUrl: 'https://nandyai.com',
      intro: 'An AI-Native Operating System For Housing Societies: Billing, Payments, Complaints, Notices And The Gate In One App, With AI That Reconciles Bank Statements Against Every Flat.',
      client: 'Nandy AI', role: 'Product Design & Full-Stack Engineering', appCategory: 'BusinessApplication',
      specs: [
        { label: 'Product', value: 'Nandy AI' }, { label: 'Category', value: 'PropTech SaaS' }, { label: 'Timeline', value: '5 Weeks · 2026' },
        { label: 'Market', value: 'Indian Societies' }, { label: 'Platforms', value: 'Web · PWA · Gate' },
      ],
      facts: [
        { value: '46', label: 'Assistant Tools', note: 'Allowlisted, Tool-Calling' },
        { value: '8', label: 'User Roles', note: 'Committee · Residents · Staff' },
        { value: '50', label: 'SQL Migrations', note: 'PostgreSQL 16 + RLS' },
        { value: '77', label: 'Test Files', note: 'Vitest + Property Tests' },
      ],
      overviewTitle: 'From Spreadsheets\nTo Autopilot',
      narrative: [
        { title: 'The Challenge', text: 'Society Payments Arrive Split Across UPI, Bank Transfers And Cheques. Committees Reconciled Them By Hand, Weekends Lost To Spreadsheets.' },
        { title: 'Our Approach', text: 'We Paired An AI Extractor With A Deterministic Matcher: The Model Reads Statements, Code Decides Matches, And An Officer Confirms Before Anything Is Written.' },
        { title: 'The Outcome', text: 'One Installable App For Dues, Payments, Complaints, Notices And The Gate, With An Assistant That Answers Only From The Society’s Own Records.' },
      ],
      modulesTitle: 'One App For\nThe Whole Society',
      modulesLead: 'Committees, Residents And Gate Staff Share One System. Each Role Sees Exactly The Pages It Should.',
      modules: [
        { title: 'Nandy Reconcile', text: 'Upload A Bank Statement; AI Extracts Every Row And A Deterministic Matcher Tags It Matched, Unmatched Or Ambiguous Against Each Flat.', tags: ['PDF · CSV · XLSX', 'DeepSeek', 'Officer Review'], art: 'reconcile', dark: true, wide: true },
        { title: 'Nandy Assistant', text: '46 Allowlisted Tools Answer From Society Records; Any Change Comes Back As A Proposal To Confirm Or Decline.', tags: ['Tool Router', 'Proposals'], art: 'assistant' },
        { title: 'Billing & Dues', text: 'Recurring Maintenance Plans, One-Off Charges, Fines, Late Fees, Credits And Payment Proofs.', tags: ['Plans', 'Fines', 'Credits'], art: 'ledger' },
        { title: 'Visitors & Gate', text: 'A Gate Console With QR Passes, Photo Capture, Pre-Registration And Live Arrival Alerts To Residents.', tags: ['QR Passes', 'Web Push'], art: 'qr' },
        { title: 'Tenant Isolation', text: 'Session → Tenant → RBAC Middleware Plus Postgres Row-Level Security And A Trigger-Backed Audit Log.', tags: ['RLS', 'RBAC', 'Audit Log'], art: 'layers', dark: true },
      ],
      architecture: {
        title: 'Two Walls Around\nEvery Society',
        summary: 'Every Request Passes Session → Tenant → RBAC And Runs In A Transaction Scoped To One Society, With Postgres RLS As The Second Wall.',
        stats: '8 Roles · 50 Migrations · Cloudflare Workers',
        columns: [
          { label: 'Clients', nodes: [{ title: 'Resident App', sub: 'Astro · Installable PWA' }, { title: 'Gate Console', sub: 'QR · Photo Capture' }, { title: 'Visitor Portal', sub: 'Pre-Registration' }] },
          { label: 'Edge', nodes: [{ title: 'Cloudflare Worker', sub: 'Astro SSR · API Proxy', highlight: true }, { title: 'Express API', sub: 'Session · Tenant · RBAC' }] },
          { label: 'Services', nodes: [{ title: 'Reconciliation', sub: 'Extract · Match · Review' }, { title: 'Assistant', sub: '46 Tools · Proposals' }, { title: 'Billing', sub: 'Plans · Fines · Credits' }, { title: 'Visitors', sub: 'Passes · Alerts' }, { title: 'Audit', sub: 'Trigger-Backed Log' }] },
          { label: 'Data', nodes: [{ title: 'PostgreSQL 16', sub: 'Row-Level Security' }, { title: 'Cloudflare R2', sub: 'Statements · Photos' }, { title: 'DeepSeek', sub: 'Extraction · Assistant' }, { title: 'Resend + Push', sub: 'Email · Web Push' }] },
        ],
        links: [[0, 0, false], [2, 0, false], [4, 0, false], [0, 1, false], [3, 1, false], [0, 2, true], [1, 2, true], [3, 3, true]],
      },
      stackLead: 'A Lean, Typed Stack With SQL You Can Read, Chosen So Tenant Isolation Is Enforced By The Database, Not Just The App.',
      stack: [
        { group: 'Frontend', items: ['Astro 6 SSR', 'Chart.js', 'Lucide', 'PWA + Push'] },
        { group: 'Backend', items: ['Node 20', 'Express 4', 'TypeScript', 'Kysely'] },
        { group: 'Data', items: ['PostgreSQL 16', 'Row-Level Security', 'Cloudflare R2'] },
        { group: 'AI', items: ['DeepSeek', 'Tool Router', 'pdf-parse', 'xlsx'] },
        { group: 'Infra', items: ['Cloudflare Workers', 'Oracle VM', 'GitHub Actions', 'Resend'] },
        { group: 'Quality', items: ['Vitest', 'fast-check', 'Docker Compose'] },
      ],
      code: {
        file: 'matching.ts', secondaryFile: 'tool-router.ts', language: 'TypeScript', highlightLine: 8,
        command: '$ wrangler deploy', commandResult: '→ nandy-app published to Cloudflare Workers',
        source: `export function classify(
  txn: CanonicalTransaction,
  residents: ResidentIdentifiers[],
): MatchOutcome {
  const desc = normalize(txn.description);
  const descAlnum = alnum(txn.description);

  // Deterministic ordering: residents by id, each resident's flats by flatId.
  const ordered = [...residents]
    .sort((a, b) => (a.residentId < b.residentId ? -1 : a.residentId > b.residentId ? 1 : 0))
    .map((r) => ({
      ...r,
      flats: [...r.flats].sort((a, b) => (a.flatId < b.flatId ? -1 : a.flatId > b.flatId ? 1 : 0)),
    }));

  // Build (resident, flat) candidate pairs from MATCHING identifiers.
  const pairs: MatchCandidate[] = [];`,
      },
      pagespeed: { performance: 99, accessibility: 100, bestPractices: 100, seo: 100 },
      dashboardLabel: 'Nandy AI officer dashboard with dues, collections, complaints, tools, announcements and activity',
      screenshot: 'nandy-dashboard.png',
    },
  },
  {
    slug: 'flowgentic', name: 'Flowgentic', category: 'Multi-Agent Orchestration', categoryShort: 'Low-Code\nAI Agents', year: '2025', duration: 'Open Source',
    summary: 'An Open-Source (MIT), Self-Hosted Canvas For Building And Coordinating Teams Of LLM Agents, Free For Anyone To Use.',
    caseStudy: {
      caseNo: '03', published: '2025-07-30', updated: '2025-07-30', status: 'Open Source · MIT', repoUrl: 'https://github.com/mry0tt4/flowgentic',
      intro: 'An Open-Source, MIT-Licensed Tool, Free For Anyone To Use, Fork And Self-Host, To Build And Coordinate Multi-Agent Teams: Wire Agents On A Canvas, Give Them Skills And Knowledge, And Ship Them Behind A Streaming API.',
      client: 'Open Source', role: 'Product, Branding & Engineering', appCategory: 'DeveloperApplication',
      specs: [
        { label: 'Product', value: 'Flowgentic' }, { label: 'Category', value: 'Multi-Agent LLMOps' }, { label: 'License', value: 'MIT · Open Source' },
        { label: 'Released', value: '2025' }, { label: 'Platforms', value: 'Web · Self-Hosted · API' },
      ],
      facts: [
        { value: '5', label: 'Node Types', note: 'Root · Leader · Worker · Freelancer' },
        { value: '2', label: 'Workflow Modes', note: 'Sequential · Hierarchical' },
        { value: '3', label: 'LLM Providers', note: 'OpenAI · Anthropic · Ollama' },
        { value: '45', label: 'REST Endpoints', note: 'Across 9 FastAPI Routers' },
      ],
      overviewTitle: 'From Graph Code\nTo A Canvas',
      narrative: [
        { title: 'The Challenge', text: 'Coordinating Specialised LLM Agents Meant Hand-Writing Graph Code, Slow To Prototype And Hard To Hand Over To Non-Engineers.' },
        { title: 'Our Approach', text: 'A Drag-And-Drop Canvas Where Agent Teams Are Wired Visually, Then Compiled Into LangGraph State Graphs, Sequential Or Hierarchical.' },
        { title: 'The Outcome', text: 'Teams Ship Multi-Agent Workflows With Tools, RAG And Human Approval Steps, And Expose Each One Through A Keyed, Streaming Public API.' },
      ],
      modulesTitle: 'Everything An\nAgent Team Needs',
      modulesLead: 'Leaders Delegate, Workers Use Skills, Knowledge Comes From Your Documents, And Humans Can Step In Before Any Action.',
      modules: [
        { title: 'Visual Team Builder', text: 'A React Flow Canvas With Snap-To-Grid Nodes; Drop An Edge On Empty Space And A New Worker Appears, Ready To Configure.', tags: ['React Flow', 'Hierarchical', 'Sequential'], art: 'tree', dark: true, wide: true },
        { title: 'Skills', text: 'Built-In DuckDuckGo, Wikipedia, Yahoo Finance And Ask-Human, Plus Your Own HTTP Skills Defined In JSON.', tags: ['Tools', 'Custom HTTP'], art: 'plugs' },
        { title: 'Knowledge Base', text: 'Upload PDFs; A Celery Worker Embeds Them With fastembed And Stores Vectors In Qdrant For Retrieval.', tags: ['RAG', 'Qdrant', 'fastembed'], art: 'vectors' },
        { title: 'Human In The Loop', text: 'Pause Any Agent Before It Acts. Approve, Reject Or Reply With Instructions Right In The Chat.', tags: ['Interrupts', 'Approvals'], art: 'approve' },
        { title: 'Public Streaming API', text: 'Per-Team API Keys And A Streaming Endpoint, With Threads Persisted Through A Postgres Checkpointer.', tags: ['SSE', 'API Keys', 'Threads'], art: 'stream', dark: true },
      ],
      architecture: {
        title: 'Canvas In,\nState Graph Out',
        summary: 'Team Config And Canvas Positions Live In Postgres; On Run, The Graph Builder Compiles Them Into A LangGraph StateGraph And Streams Tokens Back Over SSE.',
        stats: '5 Node Types · 18 Migrations · MIT Licensed',
        columns: [
          { label: 'Clients', nodes: [{ title: 'React SPA', sub: 'Vite · React Flow' }, { title: 'External Apps', sub: 'Team API Keys' }] },
          { label: 'Edge', nodes: [{ title: 'FastAPI', sub: '9 Routers · JWT', highlight: true }, { title: 'Traefik', sub: 'Reverse Proxy · TLS' }] },
          { label: 'Services', nodes: [{ title: 'Graph Builder', sub: 'LangGraph StateGraph' }, { title: 'Leader Nodes', sub: 'Delegation' }, { title: 'Worker Nodes', sub: 'Tools · Skills' }, { title: 'Celery Worker', sub: 'PDF Embeddings' }, { title: 'SSE Stream', sub: 'Token Streaming' }] },
          { label: 'Data', nodes: [{ title: 'PostgreSQL', sub: 'Teams · Checkpoints' }, { title: 'Qdrant', sub: 'Vector Store' }, { title: 'Redis', sub: 'Celery Broker' }, { title: 'LLM Providers', sub: 'OpenAI · Anthropic · Ollama' }] },
        ],
        links: [[0, 0, false], [4, 0, false], [3, 1, false], [3, 2, true], [1, 3, true], [2, 3, true]],
      },
      stackLead: 'A Typed React Canvas On A Strictly Typed Python Core, Every Model Provider Swappable Behind LangChain.',
      stack: [
        { group: 'Frontend', items: ['React 18', 'TypeScript', 'Vite 5', 'Chakra UI', 'React Flow'] },
        { group: 'Backend', items: ['FastAPI', 'SQLModel', 'Alembic', 'Pydantic 2'] },
        { group: 'AI', items: ['LangGraph', 'LangChain', 'fastembed', 'Qdrant'] },
        { group: 'Data', items: ['PostgreSQL', 'Redis', 'Celery'] },
        { group: 'Infra', items: ['Docker Compose', 'Traefik', 'Nginx', 'GitHub Actions'] },
        { group: 'Quality', items: ['Ruff', 'mypy strict', 'pytest', 'Biome'] },
      ],
      code: {
        file: 'build.py', secondaryFile: 'nodes.py', language: 'Python', highlightLine: 11,
        command: '$ docker compose up -d', commandResult: '→ backend · frontend · celery · qdrant running',
        source: `        if i > 0:
            previous_member = members[i - 1]
            if previous_member.tools:
                graph.add_conditional_edges(
                    previous_member.name,
                    should_continue,
                    create_tools_condition(
                        previous_member.name, member.name, previous_member.tools
                    ),
                )
            else:
                graph.add_edge(previous_member.name, member.name)

    # Handle the final member's tools
    final_member = members[-1]
    if final_member.tools:
        graph.add_conditional_edges(
            final_member.name,
            should_continue,
            create_tools_condition(final_member.name, END, final_member.tools),
        )
    else:
        graph.add_edge(final_member.name, END)`,
      },
      credits: 'Flowgentic Builds On The Open-Source Tribe Project (MIT) By StreetLamb, Itself Based On Tiangolo’s Full-Stack FastAPI Template. Thank You To Both Communities.',
      dashboardLabel: 'Flowgentic team builder canvas showing a hierarchical travel-planner agent team',
      screenshot: 'flowgentic-dashboard.png',
      openSource: {
        license: 'MIT', repo: 'https://github.com/mry0tt4/flowgentic',
        quickstart: ['git clone https://github.com/mry0tt4/flowgentic.git', 'cd flowgentic', '# set SECRET_KEY, FIRST_SUPERUSER_PASSWORD, POSTGRES_PASSWORD in .env', 'docker compose up -d', '# open http://localhost → Teams → New team'],
        highlights: [
          { value: '$0', label: 'Free Forever · No Seats, No Usage Fees' },
          { value: 'MIT', label: 'Use Commercially, Modify, Redistribute' },
          { value: '3', label: 'LLM Providers, Incl. Local Models Via Ollama' },
          { value: '1', label: 'Command To Self-Host With Docker Compose' },
        ],
      },
    },
  },
  {
    slug: 'infinify', name: 'Infinify', category: 'Design Studio Landing Page', categoryShort: 'Studio\nLanding Page', year: '2026', duration: '2 Weeks',
    summary: 'A Cinematic, Statically Rendered Landing Page For A Premium B2B Design Studio · Motion-Rich Without Giving Up Speed Or SEO.',
    caseStudy: {
      caseNo: '04', published: '2026-07-10', updated: '2026-07-24', status: 'Live · infinify.eu', liveUrl: 'https://infinify.eu',
      intro: 'A Cinematic Landing Page For Infinify, A Premium Design Studio For B2B & Startups, Designed And Built In Two Weeks With Nine Reusable Motion Primitives.',
      client: 'Infinify', role: 'Landing Page Design & Development', appCategory: 'WebSite',
      specs: [
        { label: 'Client', value: 'Infinify · France' }, { label: 'Category', value: 'Design Studio' }, { label: 'Timeline', value: '2 Weeks · 2026' },
        { label: 'Scope', value: 'Landing Page' }, { label: 'Stack', value: 'Next.js 16 · Motion' },
      ],
      facts: [
        { value: '7', label: 'Page Sections', note: 'Loader To Footer' },
        { value: '9', label: 'Motion Primitives', note: 'Reveal · BlurWords · CountUp…' },
        { value: '10', label: 'FAQs', note: 'With FAQPage Structured Data' },
        { value: '64', label: 'Commits', note: 'Two Weeks, July 2026' },
      ],
      overviewTitle: 'Craft You Can\nFeel In Seconds',
      narrative: [
        { title: 'The Challenge', text: 'A Premium Design Studio Needed A Landing Page That Proves Its Craft In Seconds, Cinematic Motion Without Sacrificing Speed, Accessibility Or SEO.' },
        { title: 'Our Approach', text: 'We Designed A Dark, Glassy System Around An Earth-From-Orbit Hero, Then Built Nine Reusable Motion Primitives: Pinned Reveals, Draggable Marquees And Hover Scenes.' },
        { title: 'The Outcome', text: 'A Statically Rendered Next.js Site With Structured Data, AVIF Imagery, Video That Streams Only On Play, And Full Reduced-Motion Support.' },
      ],
      modulesTitle: 'Seven Sections,\nNine Motion Primitives',
      modulesLead: 'Every Interaction Is A Reusable Component, So The Studio Can Keep Building Pages In The Same Language.',
      modules: [
        { title: 'Infinity Loader', text: 'The Infinity Mark Draws Itself By Hand In About Two Seconds, Then Lifts Away Like A Curtain To Reveal The Hero.', tags: ['SVG Stroke', 'Motion 12'], art: 'lemniscate', dark: true, wide: true },
        { title: 'Draggable Portfolio', text: 'Two Opposing Marquee Rows Of Design Shots And Mux-Streamed Showreels, With A Lightbox.', tags: ['Marquee', 'Mux · HLS'], art: 'marquee' },
        { title: 'Pinned Statement', text: 'The About Statement Pins And Reveals Word By Word As You Scroll, Over An Infinity Watermark.', tags: ['useScroll', 'Pinning'], art: 'words' },
        { title: 'Process Scenes', text: 'Three Cards With Replayable Hover Scenes, Including A Live-Counting Revenue Chip.', tags: ['CountUp', 'Hover Scenes'], art: 'revenue' },
        { title: 'SEO & Performance', text: 'JSON-LD, Open Graph, AVIF/WebP, A Preloaded Hero Image, Deferred hls.js And Reduced-Motion Paths.', tags: ['JSON-LD', 'AVIF', 'a11y'], art: 'gauge', dark: true },
      ],
      architecture: {
        title: 'Static By Default,\nStreamed On Demand',
        summary: 'A Fully Static Next.js Build: Content Lives In Typed Modules, Motion In Reusable Primitives, And Heavy Media Streams In Only When Played.',
        stats: '3 Routes · 16 Components · Static Rendering',
        columns: [
          { label: 'Visitors', nodes: [{ title: 'Browsers', sub: 'Mobile · Desktop · 4K' }, { title: 'Search & AI', sub: 'JSON-LD · Sitemap' }] },
          { label: 'Edge', nodes: [{ title: 'Next.js 16', sub: 'Static App Router', highlight: true }, { title: 'next/image', sub: 'AVIF · WebP' }] },
          { label: 'Components', nodes: [{ title: 'Sections', sub: '7 Page Sections' }, { title: 'Motion Kit', sub: '9 Primitives' }, { title: 'Lenis', sub: 'Smooth Scroll' }, { title: 'Content', sub: 'Typed Site + FAQ Data' }] },
          { label: 'Services', nodes: [{ title: 'Mux', sub: 'HLS Showreels' }, { title: 'Cal.com', sub: '15-Min Booking' }, { title: 'WhatsApp', sub: 'Direct Chat' }, { title: 'Instagram', sub: 'Social' }] },
        ],
        links: [[0, 0, true], [0, 1, false], [3, 2, false], [3, 3, false]],
      },
      stackLead: 'A Modern, Static Front-End Stack. Every Byte Of Motion Justified, Every Image Optimised.',
      stack: [
        { group: 'Frontend', items: ['Next.js 16', 'React 19', 'TypeScript'] },
        { group: 'Styling', items: ['Tailwind CSS 4', 'SF Pro', 'Space Mono'] },
        { group: 'Motion', items: ['Motion 12', 'Lenis', 'CSS Keyframes'] },
        { group: 'Media', items: ['Mux', 'hls.js', 'next/image'] },
        { group: 'SEO', items: ['JSON-LD', 'Open Graph', 'Sitemap'] },
        { group: 'Tooling', items: ['ESLint 9', 'PostCSS'] },
      ],
      code: {
        file: 'about.tsx', secondaryFile: 'process.tsx', language: 'TSX', highlightLine: 14,
        command: '$ next build', commandResult: '→ ○ /  ○ /privacy  ○ /terms  (Static)',
        source: `export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Reveal completes at 92% of the pin so the full statement reads black
  // before the section releases. The lead word counts too, so the very first
  // frame shows NO highlighted word.
  const toCount = (v: number) =>
    Math.round(Math.min(1, v / 0.92) * (REST_WORDS.length + 1));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setRevealed(toCount(v));
  });`,
      },
      pagespeed: { performance: 97, accessibility: 100, bestPractices: 100, seo: 100 },
      dashboardLabel: 'Infinify landing page hero with glass navigation pill, headline over Earth from orbit and booking calls to action',
      screenshot: 'infinify-hero.png',
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const caseStudies = projects;
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
