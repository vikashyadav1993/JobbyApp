import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errMessage: '',
    isError: false,
  }

  updateUsername = event => this.setState({username: event.target.value})

  updatePassword = event => this.setState({password: event.target.value})

  formSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const {history} = this.props

      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      this.setState({errMessage: data.error_msg, isError: true})
    }
  }

  render() {
    const {errMessage, isError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form onSubmit={this.formSubmit} className="form-container">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              onChange={this.updateUsername}
              placeholder="Username"
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              onChange={this.updatePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {isError && <p>{errMessage}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
