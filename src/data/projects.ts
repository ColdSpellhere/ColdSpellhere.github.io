export type Project = {
  name: string;
  description: string;
  language: string;
  href: string;
  focus: string[];
};

export const projects: Project[] = [
  {
    name: 'ZhiYu-CancerPrediction',
    description:
      'An engineering-focused lung-cancer treatment-response prediction demo with reproducible training, evaluation, and a Streamlit workflow.',
    language: 'Python',
    href: 'https://github.com/ColdSpellhere/ZhiYu-CancerPrediction',
    focus: ['Machine Learning', 'Evaluation', 'Streamlit'],
  },
  {
    name: 'Neuro-BirthdayWeb',
    description:
      'A responsive event site for schedules, news, and participation details, built with Next.js and Tailwind CSS.',
    language: 'TypeScript',
    href: 'https://github.com/ColdSpellhere/Neuro-BirthdayWeb',
    focus: ['Next.js', 'Product UI', 'Responsive Web'],
  },
  {
    name: 'brew-md-txt-log',
    description:
      'A macOS zsh helper that records Homebrew operations into readable Markdown and plain-text logs.',
    language: 'Shell',
    href: 'https://github.com/ColdSpellhere/brew-md-txt-log',
    focus: ['macOS', 'Automation', 'Developer Tools'],
  },
];
