
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class DetailsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movie: {},
    };
  }

  componentDidMount() {

    let id = this.props.match.params.id;

    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id)
      .then((response) => {
        // handle success
        // Store movie in state:movie
        let movie = response.data;
        this.setState({movie: movie});
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  render() {
    //Creating a variable for the link
    let linkToEdit = '/edit/' + this.props.match.params.id;

    return(
      <>
        <Helmet>
          <title>MovieApp - details</title>
        </Helmet>
        <main>
          <div>
            <h2>Title: {this.state.movie.title}</h2>
            <Link to={linkToEdit}>Edit movie info</Link>
          </div>
          <p>Description: {this.state.movie.description}</p>
          <p>Director: {this.state.movie.director}</p>
          <p>Rating: {this.state.movie.rating}</p>
        </main>
      </>
    );
  }
}

export default DetailsPage;
