import * as deepmerge from 'deepmerge'
import { Shape, Library } from '../shape'
import api from '../api'
import getInitialPlaygroundState from './getInitialPlaygroundState'

const DEFAULT_LIBRARY = {
  title: 'Source §1',
  week: 3,
  externals: [],
  files: [],
  globals: []
}

async function getInitialState(isPlayground: boolean) {
  if (isPlayground) {
    const { data } = await api.get('library')
    const libraries: Library[] = data.map((d: any) => ({
      title: d.title,
      week: d.json.week,
      externals: d.json.externals,
      files: d.json.files,
      globals: d.json.globals
    }))
    libraries.push(DEFAULT_LIBRARY)
    return getInitialPlaygroundState(location.hash, libraries)
  } else {
    const state: Partial<Shape> = {
      config: {
        libraries: [DEFAULT_LIBRARY],
        activeLayout: 'split',
        library: DEFAULT_LIBRARY,
        isPlayground,
        isReadOnly: false,
        activeTab: 'interpreter',
        filename: ''
      },
      editor: {
        value: ''
      }
    }
    const { data: newState } = await api.get(location.href, {
      params: {
        format: 'json'
      }
    })
    newState.config.activeTab = 'question'
    newState.comments = {
      comments: newState.comments,
      newComment: ''
    }
    return deepmerge(state, newState)
  }
}

export default getInitialState
