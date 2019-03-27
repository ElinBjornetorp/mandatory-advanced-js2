
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      searchInput: '',
      searchFor: '',
    };
    this.updateMovies = this.updateMovies.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  updateMovies(movies) { // 'Movies' is an array of objects
    this.setState({movies: movies});
  }

  onChange(event) {
    this.setState({searchInput: event.target.value});
  }

  onSubmit(event) {

    //Preventing form being sent
    event.preventDefault();

    //Copying search input into 'searchFor'
    this.setState({searchFor: this.state.searchInput});
  }

  render() {
    return(
      <>
        <Helmet>
          <title>MovieApp</title>
        </Helmet>
        <main>
          <form className="search-field" onSubmit={this.onSubmit}>
            <input type="text" value={this.state.searchInput} onChange={this.onChange}/>
            <button>Search</button>
          </form>
          <Table updateMovies={this.updateMovies} movies={this.state.movies} searchFor={this.state.searchFor}/>
        </main>
      </>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    this.getMovies();
  }

  //Add code here to interrupt the request
  componentWillUnmount() {}

  getMovies() {
    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies')
      .then((response) => {
        // handle success
        // Store movies in state:movies
        let movies = response.data;
        this.props.updateMovies(movies);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  onClickDelete(event) {

    //Finding id
    let id = event.target.id;

    //Making DELETE request
    axios.delete('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/' + id)
      .then((response) => {
        // Then, make a new GET request and update view
        this.getMovies();
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

    let rows = []; //This is an array to hold TableRow components
    let movies = this.props.movies;
    let searchFor = this.props.searchFor.toLowerCase(); // <-- toLowerCase makes the search case-insensitive

    //Filtering movies
    if(searchFor){
      movies = movies.filter(movie => {
        //Making variables
        let title = movie.title.toLowerCase(); // <-- Using toLowerCase to make the search case-insensitive
        let director = movie.director.toLowerCase();

        //Comparing title and director with search string
        return title.includes(searchFor) || director.includes(searchFor);
      });
    }

    //Looping through movies
    for(let movie of movies) {
      let row = <TableRow movie={movie} key={movie.id} onClickDelete={this.onClickDelete}/>;
      rows.push(row);
    }

    return(
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

class TableRow extends Component {
  render() {
    return(
      <tr>
        <TableCell content={<TitleLink title={this.props.movie.title} id={this.props.movie.id}/>}/>
        <TableCell content={this.props.movie.director}/>
        <TableCell content={this.props.movie.rating}/>
        <TableCell content={<EditButton id={this.props.movie.id}/>}/>
        <TableCell content={<DeleteButton id={this.props.movie.id} onClickDelete={this.props.onClickDelete}/>}/>
      </tr>
    );
  }
}

class TableCell extends Component {
  render() {
    return <td>{this.props.content}</td>;
  }
}

class TitleLink extends Component {
  render() {

    let linkToDetails = '/details/' + this.props.id; // Sending the id as a variable to DetailsPage

    return(
      <Link to={linkToDetails}>{this.props.title}</Link>
    );
  }
}

class EditButton extends Component {
  render() {
    //Creating a variable for the link
    let linkToEdit = '/edit/' + this.props.id;

    return(
      <button>
        <Link to={linkToEdit}>Edit</Link>
      </button>
    );
  }
}

class DeleteButton extends Component {
  render() {
    return(
      <button id={this.props.id} onClick={this.props.onClickDelete}>Delete</button>
    );
  }
}

export default {
  MainPage: MainPage,
  Table: Table,
}
