import React from 'react'
import PropTypes from 'prop-types'
import BackendResourceBadgeButton from './BackendResourceBadgeButton'

const Badge = ({domain}) => {
  const tomlUrl = `https://${domain}/.well-known/payshares.toml`
  return (
    <span className="paysharesToml">
      <BackendResourceBadgeButton label="server.toml" url={tomlUrl} />
    </span>
  )
}

Badge.propTypes = {
  domain: PropTypes.string.isRequired,
}

export default Badge
