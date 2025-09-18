export function calculateDuration(from: string | Date): string {
    const fromDate = typeof from === "string" ? new Date(from) : from;
    const now = new Date();
  
    const diffMs = now.getTime() - fromDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""}`;
    }
  
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    }
  
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }
  