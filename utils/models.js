// Translation state of a model, as shown in the app.
export function translationLabel(translation) {
  const t = translation || {}
  switch (t.status) {
    case 'success':
      return { text: 'Ready to view', tone: 'ready' }
    case 'pending':
      return { text: 'Waiting to translate', tone: 'working' }
    case 'inprogress':
      return { text: `Translating${t.progress && t.progress !== 'complete' ? `, ${t.progress.replace(' complete', '')}` : ''}`, tone: 'working' }
    case 'failed':
    case 'timeout':
      return { text: 'Translation failed', tone: 'failed' }
    default:
      return { text: 'Not translated', tone: 'idle' }
  }
}

export function isWorking(translation) {
  return translation && (translation.status === 'pending' || translation.status === 'inprogress')
}

export function fileType(objectKey) {
  return (objectKey.split('.').pop() || '').toUpperCase()
}

export const ACCEPTED_FILES = '.rvt,.rfa,.ifc,.nwd,.nwc,.dwg,.dxf,.skp,.fbx,.obj,.3dm,.stp,.step,.iges,.igs'
