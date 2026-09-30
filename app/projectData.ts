export type ProjectDetailData = {
  slug: string;
  name: string;
  meta: string;
  year: string;
  index: string;
  statement: string;
  role: string;
  summary: string;
  approachTitle: string;
  approach: string;
  outcomeTitle: string;
  outcome: string;
  externalUrl: string;
  images: string[];
  logo?: string;
};

const fashionImages = ["/project-visual-fashion.png", "/project-visual-system.png", "/project-visual-sound.png"];
const soundImages = ["/project-visual-sound.png", "/project-visual-system.png", "/project-visual-fashion.png"];
const systemImages = ["/project-visual-system.png", "/project-visual-fashion.png", "/project-visual-sound.png"];

const projects: ProjectDetailData[] = [
  {
    slug: "slidez", name: "Slidez", meta: "AI Stylist / Virtual Try-On / Consumer AI", year: "2026", index: "01",
    statement: "From a prompt to a complete, shoppable look.", role: "Founder / Product / Engineering",
    summary: "Slidez is an AI stylist that turns intent into coordinated outfits, explains why they work, and lets people try the result before they shop.",
    approachTitle: "Style is in the combination", approach: "I designed the product around the full decision: understand the occasion, retrieve real products, compose a look, rank the outfit as a whole, and make the result easy to try and share.",
    outcomeTitle: "A product built with real users", outcome: "The system now spans mobile, web and a browser extension, with a growing beta community shaping the product through real styling sessions and direct feedback.",
    externalUrl: "https://www.slidez.social/", images: fashionImages, logo: "/slidez-logo.png",
  },
  {
    slug: "verso-ai", name: "Verso AI", meta: "Flutter / Android / Music Intelligence", year: "2026", index: "02",
    statement: "An Android music experience built from zero to parity.", role: "AI Engineer / Android",
    summary: "Verso turns listening behavior into a more expressive music experience. I owned the Android build and translated an existing product direction into a release-ready Flutter app.",
    approachTitle: "Parity without copying blindly", approach: "The work combined product reconstruction, performance tuning, MusicKit integration, notifications, subscriptions and feature-flagged playback into one coherent Android experience.",
    outcomeTitle: "From empty repo to working product", outcome: "The core Android experience reached functional parity in days, then moved through device testing, playback integration and Play Store readiness.",
    externalUrl: "https://github.com/Rakulck", images: soundImages, logo: "/verso-logo.png",
  },
  {
    slug: "ibm", name: "IBM", meta: "AI Engineering / Enterprise Systems", year: "2025", index: "03",
    statement: "Making complex enterprise systems easier to use and trust.", role: "AI Engineer",
    summary: "At IBM, I worked on applied AI and enterprise engineering problems where reliability, clarity and measurable outcomes mattered as much as the underlying technology.",
    approachTitle: "Build for the real workflow", approach: "The work centered on translating complex requirements into maintainable systems, connecting data and intelligence to interfaces people could use with confidence.",
    outcomeTitle: "Practical intelligence at enterprise scale", outcome: "The result was engineering shaped around dependable delivery, traceable decisions and simpler experiences for complex operational work.",
    externalUrl: "https://www.ibm.com/", images: systemImages, logo: "/ibm-logo.jpg",
  },
  {
    slug: "bookmydoc", name: "BookMyDoc", meta: "Healthcare / Product Engineering / Booking", year: "2026", index: "04",
    statement: "A clearer path from finding care to booking it.", role: "Product Engineer",
    summary: "BookMyDoc is a healthcare product centered on reducing friction between discovering a provider and completing an appointment.",
    approachTitle: "Make the next step obvious", approach: "The product work focuses on simplifying search, presenting the information needed to decide, and keeping the booking flow direct across the experience.",
    outcomeTitle: "A focused care journey", outcome: "The result is a product direction built around clarity, fewer decision points, and a faster route to a confirmed appointment.",
    externalUrl: "https://github.com/Rakulck", images: systemImages, logo: "/bookmydoc-logo.png",
  },
  {
    slug: "innara", name: "Innara", meta: "AI Product / Full-stack Engineering", year: "2026", index: "05",
    statement: "Turning a complex workflow into a calm product experience.", role: "AI Product Engineer",
    summary: "Innara is a product engineering project focused on making an AI-assisted workflow feel clear, responsive and useful from the first interaction.",
    approachTitle: "Keep the intelligence behind the interaction", approach: "I shaped the system around a small number of understandable actions, with the interface carrying the complexity instead of exposing it to the user.",
    outcomeTitle: "A simpler product surface", outcome: "The work established a focused end-to-end experience and a foundation that can expand without losing its clarity.",
    externalUrl: "https://github.com/Rakulck", images: systemImages,
  },
  {
    slug: "founders-inc-stylist-sdk", name: "Founders Inc Stylist SDK", meta: "Retrieval / Ranking / E-Commerce", year: "2026", index: "P1",
    statement: "Intent in. Ranked outfits out. Built in one night.", role: "Solo Builder / Founders Inc Night Hack",
    summary: "A compact styling layer for retailers that converts a shopper's intent into products, outfits and a ranked recommendation.",
    approachTitle: "Designed to fit existing stores", approach: "The pipeline separated intent understanding, catalog retrieval, outfit composition and ranking so the same engine could sit behind different storefront experiences.",
    outcomeTitle: "Working integrations in roughly five hours", outcome: "The SDK was integrated into two storefront concepts during the hack, proving the same styling logic could adapt without rebuilding the shopping interface.",
    externalUrl: "https://github.com/Rakulck", images: fashionImages,
  },
  {
    slug: "yc-voice-agent", name: "YC Voice Agent", meta: "On-device AI / Voice / Healthcare", year: "2026", index: "P2",
    statement: "Private, local-first help for real care workflows.", role: "Solo Builder / YC Hackathon",
    summary: "A voice-first care assistant designed to handle common patient workflows locally, then escalate when human judgment is required.",
    approachTitle: "Useful before it is impressive", approach: "I connected on-device Gemma, speech input, appointment booking, escalation and visit summarization across a React Native app, Node service and web dashboard.",
    outcomeTitle: "A complete workflow in 20 hours", outcome: "The prototype demonstrated a private path from spoken request to action, with clear boundaries for uncertainty and human handoff.",
    externalUrl: "https://github.com/Rakulck", images: soundImages,
  },
  {
    slug: "e-mess", name: "E-Mess", meta: "PWA / Operations / Product Design", year: "2023", index: "P3",
    statement: "A faster lunch line and less food wasted.", role: "Product / Full-stack Engineering",
    summary: "E-Mess is a Flask and MySQL progressive web app built around the operational friction of campus meal service.",
    approachTitle: "Start with the queue", approach: "The experience connected meal discovery, ordering and kitchen demand into one flow, giving students a faster path while giving operators clearer signals.",
    outcomeTitle: "Operational gains people could feel", outcome: "The deployed workflow cut queue time by more than half and reduced food waste by roughly 27% in the measured setting.",
    externalUrl: "https://github.com/Rakulck/E-Mess-", images: systemImages,
  },
  {
    slug: "frontend-claude-skill", name: "Frontend Claude Skill", meta: "Claude / System Design / Developer Tools", year: "2026", index: "P4",
    statement: "Evidence-led audits for complex frontend systems.", role: "Creator / Systems Design",
    summary: "A structured audit workflow that turns a large frontend repository into a prioritized, evidence-backed plan instead of a generic checklist.",
    approachTitle: "Every recommendation needs proof", approach: "Findings are organized by priority, evidence, effort, confidence, fix and expected gain so teams can separate architectural risk from cosmetic preference.",
    outcomeTitle: "A reusable engineering lens", outcome: "The system creates a shared language for evaluating performance, maintainability, accessibility and product risk across unfamiliar codebases.",
    externalUrl: "https://github.com/Rakulck", images: systemImages,
  },
];

export const workProjects = projects.slice(0, 5);
export const personalProjects = projects.slice(5);
export const allProjects = projects;

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}
