import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../Loading.css'

import { searchInputs } from '../constants/inputs.js'
import {
  flattenApiForInstitutionState,
  nestInstitutionStateForAPI
} from '../utils/convert'

import Results from './Results'
import InputSubmit from '../InputSubmit'
import InputText from '../InputText'
import Alert from '../Alert'
import Loading from '../Loading.jsx'
import FILING_PERIODS from '../constants/dates.js'

const defaultState = {
  error: null,
  errorDelete: null,
  institutions: null,
  year: null
}

class Form extends Component {
  constructor(props) {
    super(props)

    this.state = defaultState
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.removeAnInstitutionFromState = this.removeAnInstitutionFromState.bind(
      this
    )
    this.handleYearSelection = this.handleYearSelection.bind(this)
  }

  removeAnInstitutionFromState(key) {
    let newInstitutions = this.state.institutions.filter(
      (institution, i) => i !== key
    )
    if (newInstitutions.length === 0) {
      this.setState({ institutions: defaultState.institutions })
    } else {
      this.setState({ institutions: newInstitutions })
    }
  }

  handleDeleteClick(institution, key) {
    fetch('/v2/admin/institutions', {
      method: 'DELETE',
      body: JSON.stringify(nestInstitutionStateForAPI(institution)),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(response => {
        if (response.ok) {
          this.setState({ errorDelete: defaultState.errorDelete })
          return response.json()
        } else {
          throw new Error(response.status)
        }
      })
      .then(json => {
        // need to remove the institution from the state
        this.removeAnInstitutionFromState(key)
      })
      .catch(error => {
        this.setState({ errorDelete: error.message })
      })
  }

  handleSubmit(event) {
    event.preventDefault()

     this.setState({ fetching: true })
     this.setState({ institutions: [] })
     console.log(FILING_PERIODS)
    Object.keys(FILING_PERIODS).forEach((y) => {
      console.log(FILING_PERIODS[y].id)
      let year = FILING_PERIODS[y].id

      fetch(`/v2/admin/institutions/${this.lei.value}/year/${year}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.status > 400) return response.status
          if (response.status < 300) return response.json()
        })
        .then(json => {
          if (typeof json === 'object') {
            this.setState({ institutions: [...this.state.institutions, flattenApiForInstitutionState(json)] })
          }})
        .catch(error => { })
      })

      this.setState({ fetching: false})
    }


  handleYearSelection(y) {
    this.setState({
      institutions: null,
      error: null,
      fetching: false,
      year: y
    })
  }

  doneLoanding(){
    this.setState({fetching: false})
  }

  render() {
    return (
      <React.Fragment>
          <div >
            <h3>Search for institution records</h3>
            <form
              className="SearchForm"
              onSubmit={event => this.handleSubmit(event)}
            >
              {searchInputs.map(textInput => {
                delete textInput.validation
                return (
                  <InputText
                    key={textInput.id}
                    ref={input => {
                      this[textInput.id] = input
                    }}
                    {...textInput}
                  />
                )
              })}
              <InputSubmit actionType="search" />
              {this.state.fetching ? <Loading className="LoadingInline" /> : null}
            </form>
          </div>

          <p>{this.state.fetching && this.state.institutions && this.state.institutions.length == 3 ? this.doneLoanding() : null}</p>

        {this.state.institutions  ? (
          <Results
            institutions={this.state.institutions}
            handleDeleteClick={this.handleDeleteClick}
            error={this.state.errorDelete}
          />
        ) : null}



      </React.Fragment>
    )
  }
}

Form.propTypes = {
  token: PropTypes.string.isRequired
}

export default Form
