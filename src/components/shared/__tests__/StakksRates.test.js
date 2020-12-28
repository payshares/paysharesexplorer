import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {StakksRates} from '../StakksRates'

configure({adapter: new Adapter()})

it('render positive change in rate', () => {
  const rate = shallow(<StakksRates change="2.1" usd="0.020" />)
  const changeEl = rate.find('span[style]')
  expect(changeEl.props().style.color).toEqual('#00c292')
  expect(rate.getElements()).toMatchSnapshot()
})

it('render negative change in rate', () => {
  const rate = shallow(<StakksRates change="-1.52" usd="0.025" />)
  const changeEl = rate.find('span[style]')
  expect(changeEl.props().style.color).toEqual('#fb9678')
  expect(rate.getElements()).toMatchSnapshot()
})
