import React, { Component } from 'react';

import { connect } from 'react-redux';

import * as actions from '../../actions';

import { Link } from 'react-router';

import { cards } from '../../styles/cards.scss';


class Cards extends Component {
  componentWillMount() {
    this.props.fetchSubmissions(this.props.params.id);
  }
  renderSingleSubmission(submission) {
    return (
      <div key={submission._id}>
        <h3>{submission.user.email}</h3>
        <div className={cards}>
        {this.renderSubmissionGrid(submission)}
        </div>
      </div>
    )
  }
  renderSubmissionGrid(submission) {
    return submission.questions.map((item, key) => {
      return (
        <div className="panel panel-default" key={item._id}>
          <div className="panel-heading">{item.questionText}</div>
          <div className="panel-body">{item.answer}</div>
        </div>
      );
    });
  }
  renderSubmissions() {
      return (
        <div>
        
          <div className="btn-group">
            <Link to="/questionaire" className="btn btn-default tt">
              <i className="fa fa-long-arrow-left"></i> Back to questionaires
            </Link>
          </div>

          {this.props.submissions.length > 0 &&
          <h2>Submissions for {this.props.submissions[0].questionaire.name}</h2>
          }

          {this.props.submissions.map((item) => this.renderSingleSubmission(item))}

          {this.props.submissions.length === 0 &&
            <h3>No submissions found</h3>
          }

        </div>
      );
  }
  render() {
    return (
      <div>
      {this.props.submissions && this.renderSubmissions()}
      </div>
    );
  }
}

function mapStateToProps(state) {
    return { submissions: state.submissions.submissions };
}

export default connect(mapStateToProps, actions)(Cards);
