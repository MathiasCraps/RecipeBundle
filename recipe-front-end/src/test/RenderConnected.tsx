import { shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { defaultState, handleState } from '../redux/Store'

function render(
  reactComponent: React.ReactElement,
  {
    initialState = defaultState,
    store = createStore(handleState, defaultState),
    ...renderOptions
  } = {}
) {
  function Wrapper({children}: any) {
    return <Provider store={store}>{children}</Provider>
  }

  return shallow(<Wrapper>{reactComponent}</Wrapper>, renderOptions);
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }