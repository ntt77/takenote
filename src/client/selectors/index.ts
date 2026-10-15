import { RootState } from '@/types'

export const getSettings = (state: RootState) => state.settingsState
export const getCategories = (state: RootState) => state.categoryState
export const getNotes = (state: RootState) => state.noteState
export const getAuth = (state: RootState) => state.authState
