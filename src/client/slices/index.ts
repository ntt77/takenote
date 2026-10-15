import { combineReducers, Reducer } from 'redux'

import authReducer from '@/slices/auth'
import categoryReducer from '@/slices/category'
import noteReducer from '@/slices/note'
import settingsReducer from '@/slices/settings'
import { RootState } from '@/types'

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  authState: authReducer,
  categoryState: categoryReducer,
  noteState: noteReducer,
  settingsState: settingsReducer,
})

export default rootReducer
