"use client";

import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
    data: any[];
    filename: string;
    type?: 'excel' | 'csv';
}

const ExportButton = ({ data, filename, type = 'excel' }: ExportButtonProps) => {
    const exportToExcel = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToCSV = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        if (type === 'excel') exportToExcel();
        else exportToCSV();
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/40 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-200"
        >
            {type === 'excel' ? <FileSpreadsheet size={16} /> : <FileText size={16} />}
            Export {type === 'excel' ? 'Excel' : 'CSV'}
        </button>
    );
};

export default ExportButton;
