
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class AddPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      director: '',
      rating: '0',
      errorMessage: '',
      postedSuccessfully: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Dynamic function to update the state corresponding to the input field :)
  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit(event) {

    //Preventing form being sent
    event.preventDefault();

    //Turning rating input into a number
    let ratingNr = parseFloat(this.state.rating);

    //Creating a JSON object
    let movieObject = {
      title: this.state.title,
      description: this.state.description,
      director: this.state.director,
      rating: ratingNr,
    }

    let jsonObject = JSON.stringify(movieObject);

    //Making POST request
    axios({
      method: 'post',
      url: 'http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies',
      headers: {'Content-Type': 'application/json'},
      data: jsonObject,
    })
    .then((response) => {
      //Redirecting to main page
      this.setState({postedSuccessfully: true});
    })
    //Show error message if there was an error
    .catch((error) => {
      if (error.response) {
        this.setState({ errorMessage: error.response.data[0].message.toUpperCase() });
      }
      else {
        this.setState({ errorMessage: "An error has occurred." });
      }
    });
  }

  render() {
    if(this.state.postedSuccessfully) {
      return <Redirect to="/"/>;
    }
    else {
      return(
        <>
          <Helmet>
            <title>MovieApp - add movie</title>
          </Helmet>
          <main>
            <h2>Add a new movie</h2>
            <form onSubmit={this.onSubmit}>
              Title: <input type="text" name="title" onChange={this.onChange} required /> <br/>
              Description: <textarea name="description" rows="4" cols="50" onChange={this.onChange} required/> <br/>
              Director: <input type="text" name="director" onChange={this.onChange} required/> <br/>
              Rating: <input type="range" name="rating" min="0" max="5" step="0.1" value={this.state.rating} list="tickmarks" onChange={this.onChange}/>
              <datalist id="tickmarks">
                <option value="0"/>
                <option value="1"/>
                <option value="2"/>
                <option value="3"/>
                <option value="4"/>
                <option value="5"/>
              </datalist>
              <label htmlFor="rating">{this.state.rating}</label>
              <ErrorMessage message={this.state.errorMessage} />
              <button type="submit">Add movie</button>
            </form>
          </main>
        </>
      );
    }
  }
}

class ErrorMessage extends Component {
  render() {
    return(
      <p>{this.props.message}</p>
    );
  }
}

export default {
  AddPage: AddPage,
  ErrorMessage: ErrorMessage,
};
