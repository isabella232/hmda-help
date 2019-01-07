import React, { Component } from 'react'
import ResultsActions from './ResultsActions'

import './Results.css'

class SearchResults extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null
    }

    this.tables = new Map()

    this.removeAnInstitutionFromState = this.removeAnInstitutionFromState.bind(
      this
    )
  }

  removeAnInstitutionFromState(key) {
    let newInstitutions = this.state.institutions.filter(
      (institution, i) => i !== key
    )
    if (newInstitutions.length === 0) newInstitutions = null
    this.setState({ institutions: newInstitutions })
  }

  // TODO: make this a component
  renderSearchHeading(numOfResults) {
    if (numOfResults === 0) return <h2>Sorry, no results were found.</h2>

    let resultsText = numOfResults === 1 ? 'result' : 'results'
    return (
      <h2>
        {numOfResults} {resultsText} found
      </h2>
    )
  }

  render() {
    if (!this.props.institutions) return null

    const { institutions } = this.props

    return (
      <div className="SearchResults">
        {this.renderSearchHeading(institutions.length)}

        <table className="institutions">
          <thead>
            <tr>
              <th width="15%">LEI</th>
              <th width="15%">Name</th>
              <th width="15%">Email Domain</th>
              <th width="15%">Tax ID</th>
              <th width="40%" />
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution, i) => {
              return (
                <React.Fragment key={i}>
                  <tr>
                    <td>{institution.lei}</td>
                    <td>{institution.respondentName}</td>
                    <td>{institution.emailDomains}</td>
                    <td>{institution.taxId}</td>
                    <ResultsActions
                      institution={institution}
                      i={i}
                      error={this.state.error}
                      handleDeleteClick={this.props.handleDeleteClick}
                      tables={this.tables}
                    />
                  </tr>
                  <tr
                    className="otherData hidden"
                    ref={element => this.tables.set(i, element)}
                  >
                    <td colSpan={5}>
                      <table>
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>2017 ID</th>
                            <th>RSSD</th>
                            <th>Location</th>
                            <th>Parent</th>
                            <th>Assets</th>
                            <th>Other Lender Code</th>
                            <th>Top Holder</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{institution.institutionType}</td>
                            <td>{institution.institutionId2017}</td>
                            <td>{institution.rssd}</td>
                            <td>
                              {institution.respondentCity},{' '}
                              {institution.respondentState}
                            </td>
                            <td>
                              {institution.parentName}
                              <br />
                              <span>{institution.parentIdRssd}</span>
                            </td>
                            <td>{institution.assets}</td>
                            <td>{institution.otherLenderCode}</td>
                            <td>
                              {institution.topHolderName}
                              <br />
                              <span>{institution.topHolderIdRssd}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default SearchResults
