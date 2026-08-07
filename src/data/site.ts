export const site = {
  name: 'ColdSpell',
  title: 'ColdSpell — Security, Networking & AI Engineering',
  description:
    'Technical notes and practical engineering work across security, networking, AI, Linux, and deployment.',
  tagline: 'Constantly piecing together my fragmented soul in the internet.',
  url: 'https://coldspellhere.github.io',
  github: 'https://github.com/ColdSpellhere',
  email: 'mailto:coldspell060319@gmail.com',
} as const;

export const navigation = [
  { label: 'Notes', href: '/notes/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const;

export const researchThemes = [
  {
    title: 'Security & Networking',
    description: 'Protocols, network troubleshooting, defensive thinking, and practical operations.',
    tags: ['security', 'networking', 'linux'],
  },
  {
    title: 'AI Engineering',
    description: 'LLM applications, computer vision, evaluation, and dependable AI systems.',
    tags: ['ai-engineering', 'llm', 'computer-vision'],
  },
  {
    title: 'Systems & Delivery',
    description: 'Backend work, automation, deployment, and the details that make software usable.',
    tags: ['backend', 'automation', 'deployment'],
  },
] as const;
