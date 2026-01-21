// Utility function to calculate duration between two dates in LinkedIn format
export function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const parts: string[] = [];
  
  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  }
  
  if (months > 0) {
    parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  }
  
  return parts.length > 0 ? parts.join(' ') : '1 mo';
}

// Format date range in LinkedIn style
export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const startMonth = monthNames[start.getMonth()];
  const startYear = start.getFullYear();
  
  if (end) {
    const endMonth = monthNames[end.getMonth()];
    const endYear = end.getFullYear();
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  } else {
    return `${startMonth} ${startYear} - Present`;
  }
}
