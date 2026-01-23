export function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  // LinkedIn adds 1 month because it's inclusive (e.g., Jan to Jan is 1 month)
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
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
