import './index.css'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const {history} = props

  const gotoLogin = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  const gotoHome = () => {
    history.push('/')
  }

  const gotoJobs = () => {
    history.push('/jobs')
  }

  return (
    <div className="header-container">
      <button type="button" onClick={gotoHome}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </button>
      <ul className="home-jobs-buttons-container">
        <li>
          <button type="button" onClick={gotoHome}>
            Home
          </button>
        </li>
        <li>
          <button type="button" onClick={gotoJobs}>
            Jobs
          </button>
        </li>
      </ul>
      <button type="button" className="logout-button" onClick={gotoLogin}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
