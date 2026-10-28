import { jsx as _jsx } from "react/jsx-runtime";
import { Download } from 'lucide-react';
import { Button } from './ui/button.js';
import { downloadCsv, toCsv } from '../lib/csv.js';
import { toIsoDay } from '../lib/format.js';
/** Saves the rows currently loaded on the page as a CSV file. */
export function ExportButton({ name, rows, columns }) {
    return (_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(Download, { className: "size-3.5" }), disabled: rows.length === 0, onClick: () => downloadCsv(`${name}-${toIsoDay(new Date())}.csv`, toCsv(rows, columns)), children: "Export CSV" }));
}
