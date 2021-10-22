import './index.css'
import Header from '../Header'

const Home = props => {
  const {history} = props
  const gotoJobs = () => {
    history.push('/jobs')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information,company
          reviews.Find the job that fits your abilities and potential
        </p>
        <button type="button" className="findJobs-button" onClick={gotoJobs}>
          Find Jobs
        </button>
      </div>
    </>
  )
}
export default Home
