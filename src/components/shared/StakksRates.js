import React from 'react'
import PropTypes from 'prop-types'
import FetchPonyfill from 'fetch-ponyfill'
const fetch = FetchPonyfill().fetch

const FEED_URL = 'https://api.coinmarketcap.com/v1/ticker/payshares/'
const UPDATE_INTERVAL = 5 * 60 * 1000

class StakksRatesContainer extends React.PureComponent {
  componentDidMount() {
    this.updatePrice()
    this.intervalId = setInterval(
      () => this.updatePrice.bind(this),
      UPDATE_INTERVAL
    )
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  updatePrice() {
    fetch(FEED_URL)
      .then(rsp => rsp.json())
      .then(rspJson => {
        const stakks = rspJson[0]
        const newState = {
          change: stakks.percent_change_24h,
          usd: stakks.price_usd,
        }
        this.setState(newState)
      })
      .catch(err => {
        console.error(`Failed to fetch price: [${err}]`)
        console.error(`stack: [${err.stack}]`)
      })
  }

  render() {
    if (!this.state) return null
    return <StakksRates {...this.state} />
  }
}

class StakksRates extends React.PureComponent {
  isPositive(changeNumStr) {
    const asFloat = Number.parseFloat(changeNumStr)
    return Number.isNaN(asFloat) === false && Number(asFloat) >= 0
  }

  renderChange(change) {
    const positive = this.isPositive(change)
    const valueStr = `${positive ? '+' : ''}${this.props.change}%`
    const style = {
      color: positive ? '#00c292' : '#fb9678',
    }
    return <span style={style}>{valueStr}</span>
  }

  render() {
    return (
      <span>
        XPS/USD: {this.props.usd} {this.renderChange(this.props.change)}
      </span>
    )
  }
}

StakksRates.propTypes = {
  change: PropTypes.string.isRequired,
  usd: PropTypes.string.isRequired,
}

export {StakksRatesContainer as default, StakksRates}
