/**
 * Paginates the output by splitting it into chunks of specified number of lines per page.
 * @param stdout - The standard output string.
 * @param linesPerPage - The number of lines per page.
 * @returns An array of paginated output.
 */
export const paginateOutput = (stdout: string, linesPerPage: number = 50): string[] => {
  const pages: string[] = [];
  const lines = stdout.split('\n'); // Corrected string handling

  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage).join('\n')); // Corrected string handling
  }

  return pages;
};
