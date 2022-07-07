export function dt(ts) {
  if (ts && ts['$date']) {
    return ts.$date.toString();
  } else {
    return new Date(ts).toString();
  }
}
