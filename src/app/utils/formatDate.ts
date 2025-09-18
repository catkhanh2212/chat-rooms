export function formatDate(timestamp: string | number | Date): string {
    const date = new Date(timestamp);
  
    return date.toLocaleString("en-US", {
      month: "short",    
      day: "numeric",    
      year: "numeric",   
      hour: "numeric",   
      minute: "2-digit", 
      hour12: true,      
    });
  }
  