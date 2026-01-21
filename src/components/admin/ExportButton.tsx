'use client';

export default function ExportButton() {
  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const response = await fetch(`/api/admin/export-stats?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = format === 'csv' ? 'csv' : 'xlsx';
      a.download = `statistieken-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <div className="btn-group">
      <button onClick={() => handleExport('csv')} className="btn btn--secondary">
        <span>CSV</span>
      </button>
      <button onClick={() => handleExport('excel')} className="btn btn--secondary">
        <span>Excel</span>
      </button>
    </div>
  );
}
