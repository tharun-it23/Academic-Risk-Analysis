"use client";

import { useState } from 'react';
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button 
} from "@heroui/react";
import { Upload, FileDown, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkUploadModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onSuccess?: (data: any[]) => void;
}

export const BulkUploadModal = ({ isOpen, onOpenChange, onSuccess }: BulkUploadModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setPreviewData(jsonData);
            } catch (err) {
                console.error("Error parsing Excel:", err);
                setError("Failed to parse file. Please upload a valid Excel file.");
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleUpload = async (onClose: () => void) => {
        if (!file) return;
        setLoading(true);
        // Simulate API Upload
        setTimeout(() => {
            console.log("Uploading data:", previewData);
            setLoading(false);
            if (onSuccess) onSuccess(previewData);
            setFile(null);
            setPreviewData([]);
            onClose();
        }, 1500);
    };

    const downloadTemplate = () => {
        const template = [
            { "Name": "John Doe", "Roll No": "21CSE101", "Department": "CSE", "Year": 3, "Email": "john@example.com", "GPA": 8.5, "Attendance": 85 },
            { "Name": "Jane Smith", "Roll No": "21ECE102", "Department": "ECE", "Year": 3, "Email": "jane@example.com", "GPA": 9.0, "Attendance": 92 }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Bulk Upload Students</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 bg-slate-50 dark:bg-slate-800/50">
                                <Upload size={48} className="text-slate-400 mb-4" />
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Drag & Drop or Click to Upload Excel File</p>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100 dark:file:bg-blue-900/40 dark:file:text-blue-300"
                                />
                                {file && (
                                    <p className="mt-2 text-sm text-emerald-600 font-medium">
                                        Selected: {file.name} ({previewData.length} records)
                                    </p>
                                )}
                                {error && (
                                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button size="sm" variant="ghost" onPress={downloadTemplate}>
                                <FileDown size={16} />  Download Template
                                </Button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onPress={() => handleUpload(onClose)}
                                isPending={loading}
                                isDisabled={!file || previewData.length === 0}
                                
                            >
                              {<Upload size={18} />}  Upload {previewData.length > 0 ? `(${previewData.length})` : ''}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </Modal.Container>
        </Modal>
    );
};
