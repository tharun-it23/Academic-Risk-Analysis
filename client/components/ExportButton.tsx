"use client";

import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
    data: any[];
    filename: string;
}

const COLUMN_LABELS: Record<string, string> = {
    name: 'Name',
    rollNo: 'Roll No',
    department: 'Department',
    phone: 'Phone',
    email: 'Email',
    riskStatus: 'Risk Status',
    semester: 'Semester',
};

const RISK_COLORS: Record<string, [number, number, number]> = {
    High: [220, 38, 38],
    Medium: [217, 119, 6],
    Low: [5, 150, 105],
};

const ExportButton = ({ data, filename }: ExportButtonProps) => {
    const exportToPDF = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
        });

        // ── Header background ──────────────────────────────────────────
        doc.setFillColor(67, 56, 202); // indigo-700
        doc.rect(0, 0, pageWidth, 28, 'F');

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text('Academic Risk Analysis System', 14, 11);

        // Subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(199, 210, 254); // indigo-200
        doc.text(`${filename.replace(/_/g, ' ')}  •  Generated on ${today}`, 14, 19);

        // Record count badge
        const badge = `${data.length} Record${data.length !== 1 ? 's' : ''}`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const badgeW = doc.getTextWidth(badge) + 8;
        doc.setFillColor(99, 102, 241); // indigo-500
        doc.roundedRect(pageWidth - badgeW - 14, 8, badgeW, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(badge, pageWidth - badgeW - 10, 13.5);

        // ── Build columns ──────────────────────────────────────────────
        const flatSample = flattenStudent(data[0]);
        const keys = Object.keys(flatSample).filter(k => COLUMN_LABELS[k]);
        const columns = keys.map(k => ({ header: COLUMN_LABELS[k] || k, dataKey: k }));

        const rows = data.map(s => {
            const flat = flattenStudent(s);
            return keys.reduce((acc, k) => ({ ...acc, [k]: flat[k] ?? '—' }), {});
        });

        // ── Table ──────────────────────────────────────────────────────
        autoTable(doc, {
            startY: 33,
            columns,
            body: rows,
            margin: { left: 14, right: 14 },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                font: 'helvetica',
                lineColor: [226, 232, 240],
                lineWidth: 0.2,
            },
            headStyles: {
                fillColor: [67, 56, 202],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 8.5,
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [238, 242, 255], // indigo-50
            },
            bodyStyles: {
                textColor: [30, 41, 59], // slate-800
            },
            columnStyles: {
                riskStatus: { halign: 'center' },
                semester: { halign: 'center' },
            },
            didDrawCell(hookData) {
                if (hookData.section === 'body' && hookData.column.dataKey === 'riskStatus') {
                    const cell = hookData.cell;
                    const val = String(cell.raw ?? '');
                    const color = RISK_COLORS[val];
                    if (color) {
                        doc.setFillColor(...color);
                        const rx = cell.x + (cell.width - 18) / 2;
                        const ry = cell.y + 1.5;
                        doc.roundedRect(rx, ry, 18, 5, 1.5, 1.5, 'F');
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(7.5);
                        doc.setTextColor(255, 255, 255);
                        doc.text(val, rx + 9, ry + 3.5, { align: 'center' });
                    }
                }
            },
        });

        // ── Footer on each page ────────────────────────────────────────
        const pageCount = (doc.internal as any).getNumberOfPages();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const h = doc.internal.pageSize.getHeight();
            doc.setDrawColor(203, 213, 225);
            doc.line(14, h - 10, pageWidth - 14, h - 10);
            doc.setTextColor(100, 116, 139);
            doc.text('Academic Risk Analysis System — Confidential', 14, h - 5);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, h - 5, { align: 'right' });
        }

        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <button
            onClick={exportToPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200/60 dark:border-rose-700/40 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:shadow-md hover:shadow-rose-500/10 transition-all duration-200"
        >
            <FileDown size={16} />
            Export PDF
        </button>
    );
};

/** Flatten nested student object into a single-level row */
function flattenStudent(s: any): Record<string, string> {
    return {
        name: s.name,
        rollNo: s.rollNo,
        department: s.department,
        semester: s.semester != null ? String(s.semester) : '',
        phone: s.phone || '',
        email: s.email || '',
        riskStatus: s.riskStatus || '',
    };
}

export default ExportButton;
