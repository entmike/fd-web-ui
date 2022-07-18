import { format } from "date-fns"
export function dt(ts) {
  if (ts && ts["$date"]) {
    return format(new Date(ts.$date), "MM/dd/yyyy k:mm:ss")
  } else {
    return format(new Date(ts), "MM/dd/yyyy k:mm:ss")
  }
}
