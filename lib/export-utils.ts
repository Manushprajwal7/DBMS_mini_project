/**
 * Converts expense data to CSV format and triggers a download
 */
export function exportToCSV(expenses: any[], filename = 'expenses.csv') {
  // Define the CSV headers
  const headers = ['Title', 'Amount (₹)', 'Category', 'Date'];
  
  // Map the expenses to CSV rows
  const rows = expenses.map(expense => [
    // Escape commas and quotes in the title
    `"${expense.title.replace(/"/g, '""')}"`,
    expense.amount.toFixed(2),
    expense.category,
    new Date(expense.date).toLocaleDateString()
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports expense data to PDF and triggers a download
 */
export async function exportToPDF(expenses: any[], filename = 'expenses.pdf') {
  // Dynamically import jspdf and jspdf-autotable
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Expense Report', 14, 22);
  
  // Add date range
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Add total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.text(`Total Expenses: ₹${total.toFixed(2)}`, 14, 38);
  
  // Prepare data for the table
  const tableColumn = ['Title', 'Amount (₹)', 'Category', 'Date'];
  const tableRows = expenses.map(expense => [
    expense.title,
    expense.amount.toFixed(2),
    expense.category,
    new Date(expense.date).toLocaleDateString()
  ]);
  
  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Save the PDF
  doc.save(filename);
}

/**
 * Formats date for filtering
 */
export function formatDateForFilter(date: Date): string {
  return date.toISOString().split('T')[0];
}

