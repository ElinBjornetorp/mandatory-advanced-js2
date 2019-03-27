
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import ErrorMessage from './add.js';
import { Helmet } from 'react-helmet';

class EditPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      director: '',
      rating: '',
      errorMessage: '',
      updateSuccessful: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    let id = this.props.match.params.id;

    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id)
      .then((response) => {
        // handle success
        // Store movie in state:movie
        let movie = response.data;

        this.setState({id: movie.id, title: movie.title, description: movie.description, director: movie.director, rating: movie.rating});

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  // Dynamic function to update the state corresponding to the input field :)
  onChange(event) {
    this.setState({[event.target.name]: event.target.value}, () => {console.log(this.state);});
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

    //Finding the id sent from MainPage
    let id = this.props.match.params.id;

    //Making PUT request
    axios({
      method: 'put',
      url: 'http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id,
      headers: {'Content-Type': 'application/json'},
      data: jsonObject,
    })
    .then((response) => {
      //Redirecting to main page
      this.setState({updateSuccessful: true});
    })
    .catch((error) => {
      if(error.response) {
        this.setState({errorMessage: error.response.data.details[0].message.toUpperCase()});
      }
      else {
        this.setState({errorMessage: 'An error has occurred.'});
      }
    });
  }

  render() {
    if(this.state.updateSuccessful) {
      return <Redirect to="/"/>;
    }
    else {
      return(
        <>
          <Helmet>
            <title>MovieApp - edit movie</title>
          </Helmet>
          <main>
            <h2>Edit information about a movie</h2>
            <form onSubmit={this.onSubmit}>
              Title: <input type="text" value={this.state.title} name="title" onChange={this.onChange} required/> <br/>
              Description: <textarea value={this.state.description} name="description" rows="4" cols="50" onChange={this.onChange} required/> <br/>
              Director: <input type="text" value={this.state.director} name="director" onChange={this.onChange} required/> <br/>
              Rating: <input type="range" value={this.state.rating} name="rating" min="0" max="5" step="0.1" list="tickmarks" onChange={this.onChange}/>
              <datalist id="tickmarks">
                <option value="0"/>
                <option value="1"/>
                <option value="2"/>
                <option value="3"/>
                <option value="4"/>
                <option value="5"/>
              </datalist>
              <label htmlFor="rating">{parseFloat(this.state.rating).toFixed(1)}</label>
              <ErrorMessage.ErrorMessage message={this.state.errorMessage}/>
              <button type="submit">Save</button>
            </form>
          </main>
        </>
      );
    }
  }
}

export default EditPage;
