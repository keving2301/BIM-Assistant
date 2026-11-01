// Reads the open model's object tree and properties once, so the summary panel and the assistant can answer
// questions about it (how many walls, which levels, how large a room is) without a server.

export const SUMMARY_KINDS = [
  { key: 'levels', label: 'Levels' },
  { key: 'walls', label: 'Walls' },
  { key: 'doors', label: 'Doors' },
  { key: 'windows', label: 'Windows' },
  { key: 'rooms', label: 'Rooms' }
]

// Element kinds by category or IFC class (Revit categories look like "Revit Walls", IFC classes like "IfcWall").
const KINDS = {
  walls: /^(revit )?walls?$|^ifcwall/i,
  doors: /^(revit )?doors?$|^ifcdoor/i,
  windows: /^(revit )?windows?$|^ifcwindow/i,
  rooms: /^(revit )?(rooms?|spaces?)$|^ifcspace/i,
  levels: /^(revit )?levels?$|^ifcbuildingstorey/i
}

const CATEGORY_PROPS = ['Category', 'IfcClass', 'IFC Class', 'Entity', 'IfcEntity']
const AREA_PROPS = ['NetFloorArea', 'Net Floor Area', 'GrossFloorArea', 'Gross Floor Area', 'Area']
const LEVEL_PROPS = ['Level', 'IfcDecomposes', 'IfcSpatialContainer', 'StoreyName', 'Building Storey', 'Base Constraint', 'Reference Level']
const MATERIAL_PROPS = ['Material', 'Structural Material', 'Materials', 'Material Name']
const ROOM_NUMBER_PROPS = ['Number', 'SpaceNumber', 'ComponentName']
const ROOM_TYPE_PROPS = ['LongName', 'Long Name', 'SpaceName']
// Room descriptions too generic to identify a room in a question ("what is the area of room 24").
const GENERIC_ROOM_WORDS = ['area', 'room', 'space', 'unit', 'apartment']

// IFC node names read "IfcSpace::19" or "IfcBuildingStorey::1 - First Floor"; keep the part a person would say.
function cleanName(name) {
  return String(name || '').replace(/^Ifc[A-Za-z]+::/, '').trim()
}

function propertyMap(result) {
  const map = {}
  for (const prop of result.properties || []) {
    if (prop.displayValue === '' || prop.displayValue === null || prop.displayValue === undefined) continue
    if (!(prop.displayName in map)) map[prop.displayName] = prop
  }
  return map
}

function first(map, names) {
  for (const name of names) {
    if (map[name]) return map[name]
  }
  return null
}

function kindOf(name, props) {
  const candidates = CATEGORY_PROPS.map((key) => props[key] && String(props[key].displayValue)).filter(Boolean)
  for (const [kind, pattern] of Object.entries(KINDS)) {
    if (candidates.some((value) => pattern.test(value.trim()))) return kind
  }
  return null
}

// Square meters from a property in the model's units (m², ft², mm²).
function areaInSquareMeters(prop) {
  if (!prop) return null
  const value = Number(prop.displayValue)
  if (!Number.isFinite(value)) return null
  // Units look like "autodesk.unit.unit:squareMeters-2.0.0" in the viewer, or "m^2" and "ft^2" elsewhere.
  const units = String(prop.units || '').toLowerCase()
  if (/feet|foot|ft/.test(units)) return value * 0.09290304
  if (/millimeter|mm/.test(units)) return value / 1e6
  if (/centimeter|cm/.test(units)) return value / 1e4
  return value
}

function bulkProperties(model, ids) {
  return new Promise((resolve, reject) => model.getBulkProperties(ids, {}, resolve, reject))
}

export async function buildModelIndex(model) {
  const tree = (model.getData() && model.getData().instanceTree) || model.getInstanceTree()
  const ids = []
  // The callback must not return a truthy value: that stops the enumeration.
  tree.enumNodeChildren(
    tree.getRootId(),
    (id) => {
      ids.push(id)
    },
    true
  )
  const results = await bulkProperties(model, ids)

  const groups = { walls: [], doors: [], windows: [], rooms: [] }
  const levelNames = new Set()
  const levelNodes = []
  const rooms = []
  const wallMaterials = new Map()

  // First pass: the kind of every node. Second pass: count an element only when its parent is not of the same
  // kind, so a door made of panel and frame parts counts once.
  const kinds = new Map()
  const propsById = new Map()
  for (const result of results) {
    const props = propertyMap(result)
    propsById.set(result.dbId, { result, props })
    const kind = kindOf(result.name, props)
    if (kind) kinds.set(result.dbId, kind)
  }

  for (const { result, props } of propsById.values()) {
    const kind = kinds.get(result.dbId)
    const level = first(props, LEVEL_PROPS)
    if (level && tree.getChildCount(result.dbId) === 0) levelNames.add(cleanName(String(level.displayValue).replace(/^Level:\s*/, '')))
    if (!kind) continue
    if (kind === 'levels') {
      levelNodes.push({ dbId: result.dbId, name: cleanName(result.name), elevation: Number((props.Elevation || {}).displayValue) })
      continue
    }
    if (kinds.get(tree.getNodeParentId(result.dbId)) === kind) continue
    groups[kind].push(result.dbId)
    if (kind === 'rooms') {
      const numberProp = first(props, ROOM_NUMBER_PROPS)
      const label = numberProp ? String(numberProp.displayValue) : cleanName(result.name)
      const typeProp = first(props, ROOM_TYPE_PROPS)
      const type = typeProp && String(typeProp.displayValue) !== label ? String(typeProp.displayValue) : null
      const names = [label]
      if (type && type.length > 2 && !GENERIC_ROOM_WORDS.includes(type.toLowerCase())) names.push(type)
      rooms.push({
        dbId: result.dbId,
        label,
        type,
        names,
        level: level ? cleanName(String(level.displayValue).replace(/^Level:\s*/, '')) : null,
        area: areaInSquareMeters(first(props, AREA_PROPS))
      })
    }
    if (kind === 'walls') {
      const material = first(props, MATERIAL_PROPS)
      if (material) {
        const key = String(material.displayValue)
        wallMaterials.set(key, (wallMaterials.get(key) || 0) + 1)
      }
    }
  }

  const levels = levelNodes.length
    ? levelNodes.sort((a, b) => (a.elevation || 0) - (b.elevation || 0)).map((l) => l.name)
    : [...levelNames]

  rooms.sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }))

  return {
    groups,
    levels,
    rooms,
    wallMaterials: [...wallMaterials.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
  }
}
