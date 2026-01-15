export function formatPollenAmount(
  pollenAmount: string | null | undefined
): string {
  switch (pollenAmount) {
    case 'WEINIG':
      return 'Weinig';
    case 'GEMIDDELD':
      return 'Gemiddeld';
    case 'VEEL':
      return 'Veel';
    default:
      return '-';
  }
}
