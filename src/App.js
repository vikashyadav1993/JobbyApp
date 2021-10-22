import './App.css'
import {Route, Switch, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoutes from './components/ProtectedRoutes'

// Replace your code here
const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoutes exact path="/" component={Home} />
      <ProtectedRoutes exact path="/jobs" component={Jobs} />
      <ProtectedRoutes exact path="/jobs/:id" component={JobItemDetails} />
      <ProtectedRoutes exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </div>
)

export default App
