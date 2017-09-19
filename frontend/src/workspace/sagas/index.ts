// tslint:disable:no-any
import { compressToEncodedURIComponent } from 'lz-string'
import { stringify } from 'query-string'
import { SagaIterator, delay } from 'redux-saga'
import { takeEvery, select, call, put, take, race } from 'redux-saga/effects'

import { showSuccessMessage, showWarningMessage } from '../notification'
import { Shape } from '../shape'
import { Context, createContext, runInContext, interrupt } from '../../toolchain'

import * as actionTypes from '../actionTypes'
import * as actions from '../actions'
import { loadLibrary } from '../libraryLoader'
import api, { exactApi } from '../api'

function* syncURL(action: any) {
  let lz = yield select((state: Shape) => state.editor.value)
  lz = compressToEncodedURIComponent(lz)
  const readOnly = yield select((state: Shape) => state.config.isReadOnly)
  const filename = yield select((state: Shape) => state.config.filename)
  const library = yield select((state: Shape) => state.config.library)
  const hash = stringify({
    lz,
    read_only: readOnly,
    filename,
    library: library.title
  })
  history.replaceState(undefined, '', `#${hash}`)
  if (action.type === actionTypes.SET_LIBRARY) {
    location.reload()
  }
}

function* syncURLSaga(): SagaIterator {
  yield takeEvery(
    [
      actionTypes.SET_EDITOR_VALUE,
      actionTypes.SET_FILENAME,
      actionTypes.SET_READ_ONLY,
      actionTypes.SET_LIBRARY
    ],
    syncURL
  )
}

async function postComment(content: string, codeID: string) {
  const { data: comment } = await api.post('/comments', {
    code_id: codeID,
    content
  })
  return comment
}

function* evalCode(code: string, context: Context) {
  const {result, interrupted} = yield race({
    result: call(runInContext, code, context),
    interrupted: take(actionTypes.INTERRUPT_EXECUTION)
  })
  if (result) {
    if (result.status === 'finished') {
      yield put(actions.evalInterpreterSuccess(result.value))
    } else {
      yield put(actions.evalInterpreterError(context.errors))
    }
  } else if (interrupted) {
    interrupt(context)
    yield call(showWarningMessage, 'Execution aborted by user')
  }
}

function* interpreterSaga(): SagaIterator {
  let library = yield select((state: Shape) => state.config.library)
  let context: Context

  yield takeEvery(actionTypes.EVAL_EDITOR, function*() {
    const code = yield select((state: Shape) => state.editor.value)
    context = createContext(library.week, library.externals)
    yield* evalCode(code, context)
  })

  yield takeEvery(actionTypes.SET_LIBRARY_SUCCESS, function*() {
    yield put(actions.clearInterpreter())
    library = yield select((state: Shape) => state.config.library)
    library.globals.forEach((p: any) => {
      const [key, value] = p
      window[key] = value
    })
    context = createContext(library.week, library.externals)
  })

  yield takeEvery(actionTypes.EVAL_INTERPRETER, function*(action: any) {
    const code = (action as any).payload
    if (!context) {
      context = createContext(library.week, library.externals)
    }
    yield* evalCode(code, context)
  })

  yield takeEvery(actionTypes.SET_LIBRARY, function*() {
    library = yield select((state: Shape) => state.config.library)
    yield call(loadLibrary, library)
    yield put(actions.setLibrarySuccess())
  })
}

function* commentSaga() {
  yield takeEvery(actionTypes.CREATE_COMMENT, function*() {
    const codeID = yield select((state: Shape) => state.editor.id!)
    const content = yield select((state: Shape) => state.comments.newComment)
    const comment = yield call(postComment, content, codeID)
    yield put(actions.createCommentSuccess(comment))
  })
}

function* editorSaga() {
  yield takeEvery(actionTypes.SAVE_EDITOR, function*() {
    const action = yield select((state: Shape) => state.config.saveAction)
    if (action) {
      const content = yield select((state: Shape) => state.editor.value)
      yield call(exactApi.put, action, { content: content })
      yield put(actions.saveEditorSuccess())
    }
  })
  yield takeEvery(actionTypes.SAVE_EDITOR_SUCCESS, function*() {
    yield call(showSuccessMessage, 'Saved successfully')
  })
}

function* mcqQuestionSaga() {
  yield takeEvery(actionTypes.SELECT_CHOICE, function*(action: any) {
    const id = action.payload
    yield delay(500)
    const { data } = yield call(api.post, 'path/submit_mcq', { id: id })
    yield put(
      actions.selectChoiceSuccess({
        id: data.id,
        isCorrect: data.is_correct,
        hint: data.hint
      })
    )
  })
}

function* testsSaga() {
  yield takeEvery(actionTypes.RUN_TESTS, function*() {})
}

function* mainSaga() {
  const isPlayground = yield select((state: Shape) => state.config.isPlayground)
  if (isPlayground) {
    yield* syncURLSaga()
  }
  yield* interpreterSaga()
  yield* commentSaga()
  yield* editorSaga()
  yield* mcqQuestionSaga()
  yield* testsSaga()
}

export default mainSaga
