import React, { Component } from 'react';

import { connect } from 'react-redux';

import * as actions from '../../actions';

import queryString from 'query-string';

import { Link } from 'react-router';

import { dashboardTable } from '../../styles/dashboard.scss';

class Dashboard extends Component {
  componentWillReceiveProps(nextProps) {
    if(this.props.location.query.page !== nextProps.location.query.page){
      this.props.fetchQuestionaires(nextProps.location.query.page);
    }
  }
  componentWillMount() {
    this.props.fetchQuestionaires(this.props.location.query.page);
  }
  deleteItem(id) {
    this.props.deleteQuestionaire(id);
  }
  renderQuestionaire() {
    return this.props.questionaires.docs.map((item, key) => {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{item.name}</td>
          <td>
            <div className="dropdown btn-group">
          	   <button className="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" id={`dropdown${key}`}>
          		   <i className="fa fa-gears nudge-left"></i><span className="caret"></span>
          			</button>
          			<ul className="dropdown-menu text-left pull-right" aria-labelledby={`dropdown${key}`}>
                  <li><Link to={`/survey/${item._id}`} target="_blank"><i className="fa fa-share-alt fa-fw"></i> Share Survey</Link></li>
                  <li><Link to={`/cards/${item._id}`}><i className="fa fa-book fa-fw"></i> Submission Cards</Link></li>
                   <li><Link to={`/submissions/${item._id}`}><i className="fa fa-newspaper-o fa-fw"></i> Submissions</Link></li>
          			   <li><Link to={`/questionaire/${item._id}`}><i className="fa fa-pencil fa-fw"></i> Edit</Link></li>
                   <li><a href="#" onClick={this.deleteItem.bind(this, item._id)}><i className="fa fa-trash fa-fw"></i> Delete</a></li>
                </ul>
          		</div>
          </td>
        </tr>
      );
    });
  }
  renderPagination() {
    if(!this.props.questionaires || this.props.questionaires.pages<=1) { return; }
    const currentPage = this.props.location.query.page || 1;
    //const prevQuery = this.props.location.query;
    //prevQuery['page'] = this.props.location.query.page--;
    const prevUrl = `/questionaire?` + queryString.stringify({ ...this.props.location.query, page: parseInt(currentPage)-1});
    const nextUrl = `/questionaire?` + queryString.stringify({ ...this.props.location.query, page: parseInt(currentPage)+1});

    return (
        <ul className="pagination">
          <li className={currentPage<=1?"disabled":""}>
            <Link to={currentPage<=1?"#":prevUrl}><span aria-hidden="true">&laquo;</span> Previous</Link>
          </li>
          <li className={currentPage>=this.props.questionaires.pages?"disabled":""}>
            <Link to={nextUrl}>Next <span aria-hidden="true">&raquo;</span></Link>
          </li>
        </ul>
    );
  }
  render() {
    return (
      <div>
        <div className="btn-toolbar text-xs-right">
          <Link to="/questionaire/new" className="btn btn-primary">
            <i className="fa fa-plus"></i> Create Questionaire
          </Link>
        </div>
        <table className={`table table-hover ${dashboardTable}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {this.props.questionaires && this.renderQuestionaire()}
          </tbody>
        </table>
        {this.renderPagination()}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return { questionaires: state.questionaire.questionaires };
}


export default connect(mapStateToProps, actions)(Dashboard);
