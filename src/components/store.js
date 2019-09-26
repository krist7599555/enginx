import _ from 'lodash'
import fp from 'lodash/fp'
import {readable, derived, get, writable} from 'svelte/store'
import {database} from '../firebase'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const _dates = _.range(0, 10).map(i => dayjs().startOf('day').add(i, 'day').format("D MMMM YYYY"))
export const _status = ["approved", "rejected", "waiting"];
export const _validate =_.conforms({
  "org": _.isString, // "16:00-19:00",
  "desc": _.isString, // "26 September 2019",
  "time": _.isString, // "16:00-19:00",
  "date": _.isString, // "26 September 2019",
  "room": _.isString, // "nginx",
  "owner": _.isString, // "Krist Pornpairin",
  "phone": _.isString, // "090-020-6430",
  "status": _.isString, // "approved"
})

function createEventsStore() {
  const {set, subscribe} = writable(null);
  database.ref('events').on('value', snp => {
    const newval = _.map(snp.val(), (val, id) => ({...val, id}))
    console.log("TCL: createEventsStore -> newval", newval)
    set(newval)
  })
  async function push(obj) {
    if (_validate(obj)) {
      return database.ref('events').push(obj)
    } else {
      throw new Error("wrong format obj")
    }
  }
  async function status(id, stat) {
    if (stat == "delete") {
      let prm;
      // do {
      //   prm = prompt("ALERT! type 'delete' to confirm");
      //   if (prm === null) return;
      // } while(prm.toLowerCase() != 'delete')
      return await database.ref(`events/${id}`).remove()
    } else if (_.includes(_status, stat)) {
      return await database.ref(`events/${id}/status`).set(stat)
    } else {
      throw new Error("wrong format status")
    }
  }
  return {
    subscribe,
    push,
    status
  }
}

export const events = createEventsStore()

