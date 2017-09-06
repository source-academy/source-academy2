import * as queryString from 'query-string'
import * as lzstring from 'lz-string'

import { Shape, Library } from '../shape'

type ParsedQueryString = {
  read_only?: string
  lz?: string
  filename?: string
  library?: string
}

function getInitialPlaygroundState(
  hash: string,
  libraries: Library[]
): Partial<Shape> {
  const data: ParsedQueryString = queryString.parse(hash)
  let value = ''

  if (data.lz) {
    value = lzstring.decompressFromEncodedURIComponent(data.lz)
  }

  const library =
    libraries.find(lib => lib.title === data.library) || libraries[0]

  return {
    config: {
      isPlayground: true,
      isReadOnly: data.read_only === 'true',
      filename: data.filename || '',
      activeLayout: 'split',
      libraries: libraries,
      activeTab: 'interpreter',
      library: library
    },
    editor: {
      value
    }
  }
}

export default getInitialPlaygroundState
