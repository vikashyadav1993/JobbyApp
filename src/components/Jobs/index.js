import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profile: {},
    employmentType: '',
    minimumPackage: '',
    search: '',
    jobsList: [],
    isProfileLoading: true,
    isJobsLoading: true,
    profileApiError: '',
    jobsApiError: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getAllJobs()
  }

  getProfile = async () => {
    this.setState({isProfileLoading: true})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: profileDetails,
        isProfileLoading: false,
        profileApiError: false,
      })
    } else {
      this.setState({isProfileLoading: false, profileApiError: true})
    }
  }

  getProfileList = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt={name} />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  updateEmpType = event => {
    if (event.target.checked === true) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getAllJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(
            each => each !== event.target.value,
          ),
        }),
        this.getAllJobs,
      )
    }
  }

  getEmploymentType = () => (
    <div className="employment-type-container">
      <h1>Type of Employment</h1>
      <ul className="employment-type-list-container">
        {employmentTypesList.map(item => (
          <li key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              name={item.employmentTypeId}
              value={item.employmentTypeId}
              onClick={this.updateEmpType}
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  updateSalaryRange = event => {
    this.setState({minimumPackage: event.target.value}, this.getAllJobs)
  }

  getSalaryRange = () => (
    <div className="salary-range-container">
      <h1>Salary Range</h1>
      <ul className="salary-range-list-container">
        {salaryRangesList.map(item => (
          <li key={item.salaryRangeId}>
            <input
              type="radio"
              name="salary"
              id={item.salaryRangeId}
              value={item.salaryRangeId}
              onClick={this.updateSalaryRange}
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  getAllJobs = async () => {
    this.setState({isJobsLoading: true})
    const {search, minimumPackage, employmentType} = this.state
    let employmentTypeOf = ''
    if (employmentType.length === 0) {
      employmentTypeOf = ''
    } else {
      employmentTypeOf = employmentType.join(',')
    }
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeOf}&minimum_package=${minimumPackage}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const convertData = data.jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        Package: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobsList: convertData,
        isJobsLoading: false,
        jobsApiError: false,
      })
    } else {
      this.setState({isJobsLoading: false, jobsApiError: true})
    }
  }

  eachJob = item => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      Package,
      rating,
      title,
    } = item

    return (
      <li key={id}>
        <Link to={`jobs/${id}`} className="each-job-link">
          <div>
            <img src={companyLogoUrl} alt={title} />
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
          <p>
            {location}
            {employmentType}
            <span>{Package}</span>
          </p>
          <hr />
          <p>Description</p>
          <p>{jobDescription}</p>
        </Link>
      </li>
    )
  }

  noJobsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
    </div>
  )

  showListOfJobs = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.noJobsView()
    }

    return (
      <ul className="jobs-list-container">
        {jobsList.map(item => this.eachJob(item))}
      </ul>
    )
  }

  loader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  updateSearch = event => this.setState({search: event.target.value})

  getSearch = () => {
    this.getAllJobs()
  }

  callApi = () => {
    this.getAllJobs()
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
    const {
      isJobsLoading,
      isProfileLoading,
      profileApiError,
      jobsApiError,
    } = this.state
    return (
      <div>
        <Header />
        <div className="jobs-container">
          <div>
            {isProfileLoading === true ? (
              this.loader()
            ) : (
              <div>
                {profileApiError === true ? (
                  <button type="button" onClick={this.getProfile()}>
                    Retry
                  </button>
                ) : (
                  this.getProfileList()
                )}
              </div>
            )}
            {this.getEmploymentType()}
            {this.getSalaryRange()}
          </div>
          <div>
            <div>
              <input type="search" onChange={this.updateSearch} />
              <button
                type="button"
                testid="searchButton"
                onClick={this.getSearch}
              >
                <BsSearch className="search-icon" />
              </button>
              {isJobsLoading === true ? (
                this.loader()
              ) : (
                <div>
                  {jobsApiError === true
                    ? this.failureView()
                    : this.showListOfJobs()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
