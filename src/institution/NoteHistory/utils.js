/**
 * Parses a timestamp from a historyId and returns the date as a String
 * @param {String} historyId 
 */
export const formatHistoryDate = historyId => {
  if(!historyId) return null
  const split = historyId.split('-')
  const d = new Date(parseInt(split[split.length - 1]))
  if(d === 'Invalid Date') return null
  return d.toDateString()
}


/**
 * Sorts nodes descending by ID
 * @param {Array} notes 
 */
export const sortNotes = notes => notes.sort((a,b) => b.id - a.id)


/**
 * Finds the differences between two Note snapshots
 * @param {Object} curr 
 * @param {Object} prev 
 */
export const calcDiff = (curr, prev) => {
  if(!prev) return curr
  const diffs = {}

  Object.keys(curr).forEach(key => {
    if(typeof curr[key] === 'object'){
      diffs[key] = calcDiff(curr[key], prev[key])
      return
    }
    if(curr[key] !== prev[key]){
      diffs[key] = {oldVal: prev[key], newVal: curr[key]}
    }
  })

  Object.keys(diffs).forEach(key => diffs[key] === null && delete diffs[key])
  if(!Object.keys(diffs).length) return null
  return diffs
}


/**
 * Injects the differences between each Note entry and its predecessor
 * @param {Array} notes 
 */
export const addDiff = notes => notes.map((note, idx) => {
  let prevNote = notes[idx + 1]
  const noteData = JSON.parse(note.updatedPanel)
  const prevNoteData = prevNote && JSON.parse(prevNote.updatedPanel)
  note.diff = calcDiff(noteData, prevNoteData)
  return note
})