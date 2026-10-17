import { wedding, getEventStartDate, getEventEndDate } from '../config/wedding';

/**
 * Formats a Date object to RFC 5545 UTC timestamp (YYYYMMDDTHHMMSSZ)
 */
function formatICSDateUTC(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Creates VEVENT block for an eventKey ('nikah' or 'walima')
 */
function createVEventBlock(eventKey) {
  const ev = wedding.events[eventKey];
  if (!ev) return '';

  const startDate = getEventStartDate(eventKey);
  const endDate = getEventEndDate(eventKey);
  const dtStamp = formatICSDateUTC(new Date());
  const dtStart = formatICSDateUTC(startDate);
  const dtEnd = formatICSDateUTC(endDate);

  const eventTitle = eventKey === 'nikah' ? 'Solemnisation of Nikah' : 'Walima Reception';
  const summary = `${eventTitle} - ${wedding.bride} & ${wedding.groom}`;
  const location = `${ev.venue}, ${ev.city}`;
  const uid = `${eventKey}-${ev.date.replace(/-/g, '')}@ashick-rukshana.wedding`;

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
  ].join('\r\n');
}

/**
 * Generates valid RFC 5545 iCalendar string
 */
export function generateICSContent(eventKeys = ['nikah']) {
  const vEvents = eventKeys.map(createVEventBlock).filter(Boolean).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ashick & Rukshana Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vEvents,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers client-side download of an .ics file
 */
export function downloadICS(eventKeys, filename) {
  const content = generateICSContent(eventKeys);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
