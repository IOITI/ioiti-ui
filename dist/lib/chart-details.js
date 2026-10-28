/** The details as a table's cell says them: "Trades 4, Won 75%". */
export function detailsText(details) {
    return details.map((detail) => `${detail.label} ${detail.value}`).join(', ');
}
