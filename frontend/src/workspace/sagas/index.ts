import { compressToEncodedURIComponent } from 'lz-string'
import { stringify } from 'query-string'
import { eventChannel, SagaIterator, delay } from 'redux-saga'
import { takeEvery, select, call, put } from 'redux-saga/effects'

import { showSuccessMessage } from '../notification'
import { Shape } from '../shape'
import { createSession } from '../../toolchain/session'

import * as actionTypes from '../actionTypes'
import * as actions from '../actions'
import { loadLibrary } from '../libraryLoader'
import api, { exactApi } from '../api'

function* syncURL(action: any) {
  let lz = yield select((state: Shape) => state.editor.value)
  lz = compressToEncodedURIComponent(lz)
  const read_only = yield select((state: Shape) => state.config.isReadOnly)
  const filename = yield select((state: Shape) => state.config.filename)
  const library = yield select((state: Shape) => state.config.library)
  const hash = stringify({
    lz,
    read_only,
    filename,
    library: library.title
  })
  history.replaceState(undefined, undefined as any, `#${hash}`)
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

async function postComment(content: string, code_id: string) {
  const { data: comment } = await api.post('/comments', {
    code_id,
    content
  })
  return comment
}

function interpreterChan(session: any) {
  return eventChannel(emitter => {
    session.on('start', () => {
      session.untilEnd()
    })
    session.on('errors', (errors: any[]) => {
      emitter(actions.evalInterpreterError(errors))
    })
    session.on('done', () => {
      if (session.interpreter && session.interpreter.errors.size === 0) {
        const value = session.interpreter.value
        emitter(actions.evalInterpreterSuccess(value))
      }
    })
    return () => {}
  })
}

function* interpreterSaga(): SagaIterator {
  const library = yield select((state: Shape) => state.config.library)
  const session = createSession(library.week, library.externals)
  const chan = yield call(interpreterChan, session)

  yield takeEvery(actionTypes.EVAL_EDITOR, function*() {
    const code = yield select((state: Shape) => state.editor.value)
    session.start(code)
  })

  yield takeEvery(actionTypes.SET_LIBRARY_SUCCESS, function*() {
    yield put(actions.clearInterpreter())
    const library = yield select((state: Shape) => state.config.library)
    library.globals.forEach((p: any) => {
      const [key, value] = p
      window[key] = value
    })
    session.week = library.week
    session.externals = library.externals
    session.clear()
  })

  yield takeEvery(actionTypes.EVAL_INTERPRETER, function*(action) {
    const code = (action as any).payload
    if (!session.interpreter) {
      return session.start(code)
    } else {
      return session.addCode(code)
    }
  })

  yield takeEvery(actionTypes.SET_LIBRARY, function*(action) {
    const library = yield select((state: Shape) => state.config.library)
    yield call(loadLibrary, library)
    yield put(actions.setLibrarySuccess())
  })

  yield takeEvery(chan, function*(value) {
    yield put(value)
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
      try {
        yield call(exactApi.put, action, { content: content })
        yield put(actions.saveEditorSuccess())
      } catch (e) {}
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
