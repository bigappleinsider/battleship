import React, { Component } from 'react';
import { Link } from 'react-router';

import { reduxForm, Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div className={`form-group ${error && touched ? 'has-danger' : ''}`}>
    <label>{label}</label>
      <input {...input} placeholder={label} type={type} className="form-control"/>
      {touched && ((error && <span className="text-help">{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);
const required = value => value ? undefined : 'Required';


const renderQuestions = ({ fields, meta: { touched, error } }) => (
  <div>
    <div className="form-group">
      <button type="button" className="btn btn-default" onClick={() => fields.push({})}>
        <i className="fa fa-plus"></i> Add Question
      </button>
    </div>
    {fields.map((question, index) =>
      <div className="row" key={index}>
        <div className="col-md-11">
          <Field name={`${question}.questionText`} type="text" component={renderField} label="Question" />
        </div>
        <div className="col-md-1">
            <button type="button" className="btn btn-default" title="Remove Question" onClick={() => fields.remove(index)}>
              <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
            </button>
        </div>
      </div>
    )}
  </div>
);

class Questionaire extends Component {
  componentWillMount() {
    if (this.props.params.id !== 'new') {
      this.props.fetchQuestionaire(this.props.params.id);
    }
    else{
      this.props.newQuestionaire();
      console.log(this.state, this.props);
    }
  }
  handleFormSubmit({ name, questions }) {
    if(this.props.params.id !== 'new') {
      this.props.updateQuestionaire({ id: this.props.params.id, name: name, questions: questions });
    }
    else{
      this.props.createQuestionaire({ name, questions });
    }
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div className="btn-group">
          <Link to="/questionaire" className="btn btn-default tt">
            <i className="fa fa-long-arrow-left"></i>
          </Link>
          <button type="submit" className="btn btn-primary">
            <i className="fa fa-save"></i>
          </button>
        </div>
        <Field
          name="name"
          label="Name"
          validate={[ required ]}
          component={renderField}
          type="text" />
          <FieldArray name="questions" component={renderQuestions} />
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
      </form>
    );
  }
}

Questionaire = reduxForm({
  form: 'questionaire',
  enableReinitialize: true
})(Questionaire);

export default connect(function(state) {
  return {
    initialValues: state.questionaire.questionaire
  };
}, actions)(Questionaire);
