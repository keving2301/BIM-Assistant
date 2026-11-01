// Answers the Dialogflow agent's model intents in the browser. The agent recognizes the question (HowManyWalls,
// SizeOfRoom and so on) but has no fulfillment for it, so the answer comes from the model open in the viewer.
import { plural } from './format'

export const SUGGESTIONS = [
  'How many walls are there?',
  'How many doors are there?',
  'How many windows are there?',
  'How many levels are there?',
  'How many rooms are there?',
  'What are the walls made of?',
  'Explode the model'
]

export const CAPABILITIES =
  'In this viewer I can count the walls, doors, windows, rooms and levels of the open model, give the floor area of a room, list the wall materials and explode the model.'

const INTENT_KINDS = {
  HowManyWalls: 'walls',
  HowManyDoors: 'doors',
  HowManyWindows: 'windows',
  HowManyRooms: 'rooms',
  FloorLevels: 'levels'
}

const KIND_WORDS = [
  ['walls', /\bwalls?\b/i],
  ['doors', /\bdoors?\b/i],
  ['windows', /\bwindows?\b/i],
  ['rooms', /\b(rooms?|spaces?|apartments?|units?)\b/i],
  ['levels', /\b(levels?|floors?|storeys?|stories|story)\b/i]
]

const UNSUPPORTED_WORDS = /\b(stairs?|staircases?|columns?|beams?|slabs?|tiles?|furniture|roofs?|railings?|pipes?|ducts?)\b/i

const KIND_NAMES = { walls: 'wall', doors: 'door', windows: 'window', rooms: 'room', levels: 'level' }

function kindFromText(text) {
  const found = KIND_WORDS.find(([, pattern]) => pattern.test(text))
  return found ? found[0] : null
}

function listSentence(items) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function findRoom(index, text) {
  const words = text.toLowerCase()
  // Prefer the longest matching name, so "room 24" does not match room "2".
  const candidates = []
  for (const room of index.rooms) {
    for (const name of room.names) {
      const n = String(name).toLowerCase().trim()
      if (!n) continue
      const pattern = new RegExp(`(^|[^a-z0-9])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i')
      if (pattern.test(words)) candidates.push({ room, length: n.length })
    }
  }
  candidates.sort((a, b) => b.length - a.length)
  return candidates.length ? candidates[0].room : null
}

// Returns { text, action } for an intent, or null when the agent's own reply is enough.
// action is one of: { isolate: dbIds }, { focus: dbId }, { explode: true }.
export function answer(intent, queryText, index) {
  const text = queryText || ''

  if (intent === 'WhatCanYouDo' || intent === 'CanYouHelpMe') {
    return { text: CAPABILITIES, chips: true }
  }

  const modelIntents = ['HowManyWalls', 'HowManyDoors', 'HowManyWindows', 'HowManyRooms', 'FloorLevels', 'SizeOfRoom', 'MaterialOfWalls', 'ExplodeModel']
  if (!modelIntents.includes(intent)) {
    return intent === 'Default Fallback Intent' ? { text: 'You can ask me one of these:', chips: true } : null
  }

  if (!index) {
    return { text: 'Open a model in the viewer first, then ask again.' }
  }

  if (intent === 'ExplodeModel') {
    return { text: 'The model is pulled apart so you can see its parts. Select Show all in the panel to put it back together.', action: { explode: true } }
  }

  if (intent === 'MaterialOfWalls') {
    const materials = index.wallMaterials
    if (!materials.length) return { text: 'This model does not list materials for its walls.' }
    const top = materials.slice(0, 4).map((m) => `${m.name} (${plural(m.count, 'wall')})`)
    return {
      text: `The walls use ${plural(materials.length, 'material')}. The most common are ${listSentence(top)}.`,
      action: { isolate: index.groups.walls }
    }
  }

  if (intent === 'SizeOfRoom') {
    if (!index.rooms.length) return { text: 'This model has no rooms, so I cannot give a room size.' }
    const room = findRoom(index, text)
    if (!room) {
      const names = index.rooms.slice(0, 12).map((r) => r.label)
      return {
        text: `Which room do you mean? This model has ${plural(index.rooms.length, 'room')}: ${listSentence(names)}${index.rooms.length > 12 ? ' and more' : ''}. Ask for example: What is the size of room ${index.rooms[0].label}?`
      }
    }
    const where = room.level ? ` on ${room.level}` : ''
    const name = `Room ${room.label}${room.type ? ` (${room.type})` : ''}`
    if (!room.area) return { text: `${name}${where} has no area in the model.`, action: { focus: room.dbId } }
    return {
      text: `${name}${where} has a floor area of ${room.area.toFixed(1)} m² (${(room.area * 10.7639).toFixed(0)} sq ft). It is highlighted in the viewer.`,
      action: { focus: room.dbId }
    }
  }

  // Counting questions. The agent files some unrelated counts under HowManyWindows, so read the question itself.
  const kind = kindFromText(text) || (UNSUPPORTED_WORDS.test(text) ? null : INTENT_KINDS[intent])
  if (!kind) {
    return { text: 'I can count the walls, doors, windows, rooms and levels of this model. Ask about one of those.' }
  }
  if (kind === 'levels') {
    if (!index.levels.length) return { text: 'This model does not define levels.' }
    return { text: `This model has ${plural(index.levels.length, 'level')}: ${listSentence(index.levels)}.` }
  }
  const ids = index.groups[kind] || []
  if (!ids.length) return { text: `I could not find any ${kind} in this model.` }
  return {
    text: `This model has ${plural(ids.length, KIND_NAMES[kind])}. ${ids.length === 1 ? 'It is' : 'They are'} isolated in the viewer; select Show all in the panel to see the whole model again.`,
    action: { isolate: ids }
  }
}
