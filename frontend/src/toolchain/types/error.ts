import * as es from 'estree'

export interface SourceError {
  location: es.SourceLocation
  explain(): string
  elaborate(): string
}
