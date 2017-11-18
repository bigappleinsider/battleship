import React, { Component } from 'react';
import { Link } from 'react-router';

import { reduxForm, Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
  const FieldType = type;
  return (
    <div className={`form-group ${error && touched ? 'has-danger' : ''}`}>
      <label>{label}</label>
      <FieldType {...input} placeholder={label} type={type} className="form-control"></FieldType>
      {touched && ((error && <span className="text-help">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  );
}

const renderQuestions = ({ fields, meta: { touched, error } }) => {
  return (
    <div>
      {fields.map((question, index) =>
        <div className="row" key={index}>
          <div className="col-md-11">
            <Field name={`${question}.answer`} type="textarea" component={renderField} label={fields.get(index).questionText} />
          </div>
        </div>
      )}
    </div>
  );
}


class Survey extends Component {
  componentWillMount() {
    this.props.fetchQuestionaire(this.props.params.id);
  }
  handleFormSubmit({ questions }) {
    this.props.filloutSurvey({ questions, id: this.props.params.id });
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <h1>{this.props.questionaire && this.props.questionaire.name}</h1>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <FieldArray name="questions" component={renderQuestions} />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

Survey = reduxForm({
  form: 'surveyForm',
  enableReinitialize: true
})(Survey);

export default connect(function(state) {
  return {
    questionaire: state.questionaire.questionaire,
    initialValues: state.questionaire.questionaire
  }
}, actions)(Survey);
