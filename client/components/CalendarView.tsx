"use client";

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import api from '../config/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from "@heroui/react";
import { Spinner } from "@heroui/react";

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent extends Event {
    type?: 'attendance' | 'exam' | 'deadline';
    status?: 'present' | 'absent';
}

const CalendarView = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Mock API call
                // const res = await api.get('/students/calendar/events');

                // Mock data
                const mockEvents: CalendarEvent[] = [
                    {
                        title: 'Mid-Term Exam',
                        start: new Date(new Date().setHours(10, 0)),
                        end: new Date(new Date().setHours(12, 0)),
                        type: 'exam'
                    },
                    {
                        title: 'Project Deadline',
                        start: new Date(new Date().setDate(new Date().getDate() + 2)),
                        end: new Date(new Date().setDate(new Date().getDate() + 2)),
                        type: 'deadline'
                    },
                    {
                        title: 'Present',
                        start: new Date(new Date().setHours(9, 0)),
                        end: new Date(new Date().setHours(16, 0)),
                        type: 'attendance',
                        status: 'present',
                        allDay: true
                    }
                ];

                setEvents(mockEvents);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching calendar events:', err);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // default blue
        let borderColor = '#2563eb';

        switch (event.type) {
            case 'attendance':
                if (event.status === 'present') {
                    backgroundColor = '#10b981'; // emerald-500
                    borderColor = '#059669';
                } else if (event.status === 'absent') {
                    backgroundColor = '#ef4444'; // red-500
                    borderColor = '#dc2626';
                }
                break;
            case 'exam':
                backgroundColor = '#f59e0b'; // amber-500
                borderColor = '#d97706';
                break;
            case 'deadline':
                backgroundColor = '#8b5cf6'; // violet-500
                borderColor = '#7c3aed';
                break;
            default:
                break;
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="flex justify-between items-center px-6 py-4 border-b border-default-200">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    📅 Academic Schedule
                </h2>
                <div className="flex gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600 dark:text-slate-300">Present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span className="text-slate-600 dark:text-slate-300">Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600 dark:text-slate-300">Exams</span>
                    </div>
                </div>
            </Card.Header>
            <Card.Content className="p-0">
                {loading ? (
                    <div className="h-[500px] flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="h-[600px] p-4 text-sm text-slate-800 dark:text-slate-200">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            eventPropGetter={eventStyleGetter}
                            views={['month', 'week', 'day', 'agenda']}
                            defaultView={Views.MONTH}
                            popup
                            className="rbc-calendar-light"
                        />
                    </div>
                )}
            </Card.Content>
        </Card>
    );
};

export default CalendarView;
