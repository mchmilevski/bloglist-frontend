import { useState } from 'react'

const Togglabe = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  return (
    <div id="togglabe">
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <button id="view-button" style={hideWhenVisible} onClick={() => setVisible(true)}>{props.label}</button>
      </div>
      <div style={showWhenVisible}>

        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
          { props. children }
          <button style={{ ...showWhenVisible, marginTop: '10px' }} onClick={() => setVisible(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Togglabe