import { format } from "date-fns"
import { indexOf } from "lodash"
export function dt(ts) {
  try{
    if (ts && ts["$date"]) {
      let d = ts.$date
      if(!indexOf(d,'Z')===-1) d+='Z'
      console.log(d)
      return format(new Date(d), "MM/dd/yyyy k:mm:ss")
    } else {
      let d = ts
      if(!indexOf(d,'Z')===-1) d+='Z'
      console.log(ts)
      return format(new Date(ts), "MM/dd/yyyy k:mm:ss")
    }
  }catch(e){
    return ts.$date
  }
}
