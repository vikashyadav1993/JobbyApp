import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobData: {},
    isLoading: true,
    similarJobDetails: [],
    setSkills: [],
    companyLife: {},
    apiStatus: '',
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({isLoading: true})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobDetails = data.job_details

      const similarJobs = data.similar_jobs
      const similarJobsData = similarJobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      const convertedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(item => ({
          imageUrl: item.image_url,
          name: item.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }

      this.setState({
        jobData: convertedData,
        similarJobDetails: similarJobsData,
        isLoading: false,
        setSkills: convertedData.skills,
        companyLife: convertedData.lifeAtCompany,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE', isLoading: false})
    }
  }

  getSkills = () => {
    const {setSkills} = this.state
    return (
      <ul>
        {setSkills.map(item => (
          <li>
            <img src={item.imageUrl} alt={item.name} />
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  getsimilarJobs = () => {
    const {similarJobDetails} = this.state
    return (
      <div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobDetails.map(item => (
            <li>
              <img src={item.companyLogoUrl} alt={item.title} />
              <h1>{item.title}</h1>
              <p>{item.rating}</p>
              <h1>Description</h1>
              <p>{item.jobDescription}</p>
              <p>{item.location}</p>
              <p>{item.employmentType}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  topContainer = () => {
    const {jobData, companyLife} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData
    console.log(jobData)
    return (
      <div>
        <img src={companyLogoUrl} alt={id} />
        <h1>{title}</h1>
        <p>{rating}</p>
        <p>{location}</p>
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
        <hr />
        <p>Description</p>
        <a href={companyWebsiteUrl}>Visit</a>
        <p>{jobDescription}</p>
        <h1>Skills</h1>
        {this.getSkills()}
        <h1>Life at Company</h1>
        <p>{companyLife.description}</p>
        <img src={companyLife.imageUrl} alt={title} />
        {this.getsimilarJobs()}
      </div>
    )
  }

  loader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  callApi = () => {
    this.getJobData()
  }

  failureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.callApi}>
        Retry
      </button>
    </>
  )

  render() {
    const {isLoading, apiStatus} = this.state
    console.log(apiStatus)
    return (
      <div>
        <Header />
        {isLoading === true ? (
          this.loader()
        ) : (
          <>
            {apiStatus !== 'FAILURE' ? this.topContainer() : this.failureView()}
          </>
        )}
      </div>
    )
  }
}
export default JobItemDetails
