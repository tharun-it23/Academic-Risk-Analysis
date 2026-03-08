"use client";

import { Button } from "@heroui/react";
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

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        // Save file
        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToCSV = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Convert to CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');

        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        if (type === 'excel') {
            exportToExcel();
        } else if (type === 'csv') {
            exportToCSV();
        }
    };

    return (
        <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={type === 'excel' ? <FileSpreadsheet size={18} /> : <FileText size={18} />}
            onPress={handleExport}
        >
            Export {type === 'excel' ? 'Excel' : 'CSV'}
        </Button>
    );
};

export default ExportButton;
