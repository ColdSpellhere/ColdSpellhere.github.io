export type Contribution = {
  repository: string;
  pullRequest: string;
  title: string;
  href: string;
};

export const contributions: Contribution[] = [
  {
    repository: 'MaaAssistantArknights/MaaAssistantArknights',
    pullRequest: '#16870',
    title: 'Record MaaMacGui sub-repository updates in the changelog',
    href: 'https://github.com/MaaAssistantArknights/MaaAssistantArknights/pull/16870',
  },
  {
    repository: 'MaaAssistantArknights/MaaAssistantArknights',
    pullRequest: '#16978',
    title: 'Fix contributor mentions in the MaaMacGui changelog',
    href: 'https://github.com/MaaAssistantArknights/MaaAssistantArknights/pull/16978',
  },
  {
    repository: 'MaaAssistantArknights/MaaMacGui',
    pullRequest: '#91',
    title: 'Add strategy guidance for Reclamation Algorithm restart checkpoints',
    href: 'https://github.com/MaaAssistantArknights/MaaMacGui/pull/91',
  },
];
