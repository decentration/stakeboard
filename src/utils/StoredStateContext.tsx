import React, { Dispatch, useEffect, useReducer } from 'react'
import {
  favoriteReducer,
  denominationReducer,
  StoredStateActions,
} from '../state/storedReducers'

export interface State {
  favorites: string[]
  denomination: number
}

export const StoredStateContext = React.createContext<{
  state: State
  dispatch: Dispatch<StoredStateActions>
}>({
  state: { favorites: [], denomination: 100 },
  dispatch: () => null,
})

const mainReducer = (
  { favorites, denomination }: State,
  action: StoredStateActions
) => ({
  favorites: favoriteReducer(favorites, action as StoredStateActions),
  denomination: denominationReducer(denomination, action as StoredStateActions),
})

export const StoredStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    mainReducer,
    {
      favorites: [],
      denomination: 100,
    },
    (initialArg) => {
      try {
        const item = window.localStorage.getItem('staking-state')
        const data = item ? JSON.parse(item) : initialArg
        if (!data.denomination) data.denomination = 100
        return data
      } catch (err) {
        console.log(err)
        return initialArg
      }
    }
  )

  useEffect(() => {
    try {
      window.localStorage.setItem('staking-state', JSON.stringify(state))
    } catch (err) {
      console.log(err)
    }
  }, [state])

  return (
    <StoredStateContext.Provider value={{ state, dispatch }}>
      {children}
    </StoredStateContext.Provider>
  )
}
