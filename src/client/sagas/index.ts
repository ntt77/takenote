import { all, put, takeLatest, select } from 'redux-saga/effects'

import { requestCategories, requestNotes, requestSettings, saveSettings } from '@/api'
import { loadCategories, loadCategoriesError, loadCategoriesSuccess } from '@/slices/category'
import { loadNotes, loadNotesError, loadNotesSuccess } from '@/slices/note'
import { login, loginSuccess, logout, logoutSuccess } from '@/slices/auth'
import {
  updateCodeMirrorOption,
  loadSettingsSuccess,
  loadSettingsError,
  loadSettings,
  toggleDarkTheme,
  togglePreviewMarkdown,
  toggleSettingsModal,
  updateNotesSortStrategy,
} from '@/slices/settings'
import { getSettings } from '@/selectors'

function* loginUser() {
  yield put(loginSuccess({ name: 'User' }))
}

function* logoutUser() {
  yield put(logoutSuccess())
}

// Get notes from localStorage
function* fetchNotes(): Generator<any, void, any> {
  try {
    const data = yield requestNotes()
    const { notesSortKey } = yield select(getSettings)

    yield put(loadNotesSuccess({ notes: data, sortOrderKey: notesSortKey }))
  } catch (error: any) {
    yield put(loadNotesError(error.message))
  }
}

// Get categories from localStorage
function* fetchCategories(): Generator<any, void, any> {
  try {
    const data = yield requestCategories()

    yield put(loadCategoriesSuccess(data))
  } catch (error: any) {
    yield put(loadCategoriesError(error.message))
  }
}

// Get settings from localStorage
function* fetchSettings(): Generator<any, void, any> {
  try {
    const data = yield requestSettings()

    yield put(loadSettingsSuccess(data))
  } catch (error) {
    yield put(loadSettingsError())
  }
}

function* persistSettings(): Generator<any, void, any> {
  try {
    const settings = yield select(getSettings)

    yield saveSettings(settings)
  } catch (error) {}
}

function* rootSaga() {
  yield all([
    takeLatest(login.type, loginUser),
    takeLatest(logout.type, logoutUser),
    takeLatest(loadNotes.type, fetchNotes),
    takeLatest(loadCategories.type, fetchCategories),
    takeLatest(loadSettings.type, fetchSettings),
    takeLatest(
      [
        toggleDarkTheme.type,
        togglePreviewMarkdown.type,
        updateCodeMirrorOption.type,
        toggleSettingsModal.type,
        updateNotesSortStrategy.type,
      ],
      persistSettings
    ),
  ])
}

export default rootSaga
