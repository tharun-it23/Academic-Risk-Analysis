"use client";

import { useState, useEffect } from 'react';
import api from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Label, ListBox, Select } from "@heroui/react";
import { BarChart2, Calendar, AlertTriangle } from 'lucide-react';

const MonthlyRiskAnalytics = () => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(new Set([String(currentDate.getMonth() + 1)]));
    const [selectedYear, setSelectedYear] = useState(new Set([String(currentDate.getFullYear())]));
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const months = [
        { value: "1", label: 'January' },
        { value: "2", label: 'February' },
        { value: "3", label: 'March' },
        { value: "4", label: 'April' },
        { value: "5", label: 'May' },
        { value: "6", label: 'June' },
        { value: "7", label: 'July' },
        { value: "8", label: 'August' },
        { value: "9", label: 'September' },
        { value: "10", label: 'October' },
        { value: "11", label: 'November' },
        { value: "12", label: 'December' }
    ];

    // Generate year options
    const years = [];
    for (let year = 2020; year <= currentDate.getFullYear() + 1; year++) {
        years.push({ value: String(year), label: String(year) });
    }

    const fetchMonthlyData = async () => {
        setLoading(true);
        setError(null);
        try {
            const monthVal = Array.from(selectedMonth)[0];
            const yearVal = Array.from(selectedYear)[0];
            const res = await api.get(`/students/stats/monthly?month=${monthVal}&year=${yearVal}`);
            setData(res.data.departments || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch monthly data');
            // Fallback Mock Data for demo
            setData([
                { name: 'CSE', highRisk: 5, mediumRisk: 10, lowRisk: 40 },
                { name: 'ECE', highRisk: 3, mediumRisk: 8, lowRisk: 35 },
                { name: 'MECH', highRisk: 6, mediumRisk: 12, lowRisk: 30 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyData();
    }, [selectedMonth, selectedYear]);

    return (
        <Card className="min-h-[400px] h-full">
            <Card.Header className="flex flex-col items-start gap-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <BarChart2 size={24} className="text-blue-500" />
                    Monthly Risk Analytics
                </h3>
                <div className="flex gap-4 w-full max-w-md">
                    <Select className="w-full max-w-xs" placeholder="Select Month">
                        <Label>Month</Label>
                        <Select.Trigger>
                            <Select.Value>{months.find(m => m.value === Array.from(selectedMonth)[0])?.label}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox 
                                selectionMode="single" 
                                selectedKeys={selectedMonth} 
                                onSelectionChange={(keys) => setSelectedMonth(keys as Set<string>)}
                            >
                                {months.map((month) => (
                                    <ListBox.Item key={month.value} id={month.value} textValue={month.label}>
                                        {month.label}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <Select className="w-full max-w-xs" placeholder="Select Year">
                        <Label>Year</Label>
                        <Select.Trigger>
                            <Select.Value>{Array.from(selectedYear)[0]}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox 
                                selectionMode="single" 
                                selectedKeys={selectedYear} 
                                onSelectionChange={(keys) => setSelectedYear(keys as Set<string>)}
                            >
                                {years.map((year) => (
                                    <ListBox.Item key={year.value} id={year.value} textValue={year.label}>
                                        {year.label}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
            </Card.Header>
            <Card.Content>
                {loading ? (
                    <div className="flex h-[300px] items-center justify-center">Loading...</div>
                ) : (
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Card.Content>
        </Card>
    );
};

export default MonthlyRiskAnalytics;
