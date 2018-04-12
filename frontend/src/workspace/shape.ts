export enum LayoutTypes {
  SPLIT = 'split',
  EDITOR_ONLY = 'editor-only',
  SIDE_CONTENT_ONLY = 'side-content-only'
}

export type Library = {
  title: string
  week: number
  externals: string[]
  files: string[]
  globals: [string, any][]
}

export type TestCase = {
  id: number
  code: string
  expected: string
  submitted: boolean
  correct: boolean
}

export type ProgrammingQuestion = {
  id: number
  content: string
  marks: number
  maxMarks: number
  tests: TestCase[]
}

export type Config = {
  isReadOnly: boolean
  isPlayground: boolean
  activeLayout: LayoutTypes
  filename: string
  libraries: Library[]
  library: Library
  saveAction?: string
  previousAction?: string
  nextAction?: string
  assessmentType?: string
  questionType?: string
  questionId?: string
  activeTab: string
}

export type CodeOutput = {
  type: 'code'
  value: string
}

export type ResultOutput = {
  type: 'result'
  value: any
  runtime?: number
  isProgram?: boolean
}

export type ErrorOutput = {
  type: 'errors'
  errors: any[]
}

export type LogOutput = {
  type: 'log'
  value: string
}

export type InterpreterOutput =
  | CodeOutput
  | ResultOutput
  | ErrorOutput
  | LogOutput

export type InterpreterState = {
  outputs: InterpreterOutput[]
}

export type EditorState = {
  id?: string
  isDirty: boolean
  value: string
  savedAt?: Date
}

export type DebugState = {
  isRunning: boolean
  elapsed: number
}

export type Comment = {
  id: number
  content: string
  posterName: string
  createdAt: string
}

export type CommentState = {
  newComment: string
  comments: Comment[]
}

export type MCQChoice = {
  id: number
  selected: boolean
  content: string
}

export type MCQQuestion = {
  done: boolean
  id: number
  hint?: string
  content: string
  choices: MCQChoice[]
}

export type Shape = {
  config: Config
  programmingQuestion: ProgrammingQuestion
  interpreter: InterpreterState
  editor: EditorState
  comments: CommentState
  mcqQuestion: MCQQuestion
  debug: DebugState
}
