import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "../App.css";



function image(img){
      	       return(
		<img src={img} alt="pokemon sprite"/>
	       );
      }

function addButton(btn) {
	 $(function () {
  	 	    $('[data-toggle="popover"]').popover().click(function () {
    		    		setTimeout(function () {
        				$('[data-toggle="popover"]').popover('hide');
    				}, 2000);
	 			})
	 })

	 return(
		<button
			onClick={() => { window.dash.addPokemon(btn[0], btn[1], btn[2], btn[3]); }}
			data-toggle = "popover"
			data-content = "Added!"
			className="btn btn-outline-success">
				Add to team
		</button>
	 )
}

function remButton(name) {
	 return(
		<button onClick={ () => { window.dash.removePokemon(name) }}
			className="btn btn-outline-danger">
			Remove from team
		</button>
	 )
}

const columns = [{
  dataField: 'sprite',
  text: 'Sprite',
  formatter: image
}, {
  dataField: 'name',
  text: 'Name',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
    dataField: "type2",
    text: "Type2",
    sort: true
}, {
    dataField: "button",
    text: "",
    formatter: addButton
}];

const teamColumns = [{
  dataField: 'sprite',
  text: 'Sprite',
  formatter: image
}, {
  dataField: 'name',
  text: 'Name',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
    dataField: "type2",
    text: "Type2",
    sort: true
}, {
    dataField: "button",
    text: "",
    formatter: remButton
}];

const cachedPokemon = {};

class Dashboard extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

constructor(props) {
    super(props);
    window.dash = this;

    this.inputHandler= this.inputHandler.bind(this);	      
    this.onSearch = this.onSearch.bind(this);

    // Initialize app state
    this.state = {
    	      name: "",
	      color: "",
	      results: [],
	      pokemonList: []
	      };
	      
    }

    inputHandler = (e) => {
    	this.setState({
		[e.currentTarget.id]: e.currentTarget.value
	})
	}

    onSearch = async (e) => {
    	e.preventDefault();

	//check if pokemon data is already cached
	
	if(!cachedPokemon[this.state.name])
	{
		await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.name}`)
		.then(res => this.setState({
			     'results': res.data },
			     () => { ReactDOM.render(<Table results={this.state.results}/>, document.querySelector("#container"));
			     	     cachedPokemon[this.state.name] = this.state.results;
				     }))
		.catch(err => { console.log(err);
				ReactDOM.render(<h2> No results found </h2>, document.querySelector("#container"));
				});

    	}

	else{
		ReactDOM.render(<Table results={cachedPokemon[this.state.name]}/>, document.querySelector("#container"))
	}
	}


    searchByColor = async (e) => {
    	e.preventDefault();

	// clear previous results
	await this.setState({ 'pokemonList': [] });	
	    
	await axios.get(`https://pokeapi.co/api/v2/pokemon-color/${this.state.color}`)
	.then(res => {
		   this.setState({
			     'results': res.data },
			     async () => {
			     	var pokemon = this.state.results.pokemon_species;

				for(var index = 0; index < pokemon.length; index++){
				
					// special cases where species name is different from entry name
					
				        if (pokemon[index].name === "giratina") {
					   pokemon[index].name = "giratina-altered";
					}
					if (pokemon[index].name === "meloetta") {
					   pokemon[index].name = "meloetta-aria";
					}
					if (pokemon[index].name === "deoxys") {
					   pokemon[index].name = "deoxys-normal";
					}
					if (pokemon[index].name === "darmanitan") {
					   pokemon[index].name = "darmanitan-standard";
					}
					if (pokemon[index].name === "oricorio") {
					   pokemon[index].name = "oricorio-baile";
					}
					if (pokemon[index].name === "thundurus") {
					   pokemon[index].name = "thundurus-incarnate";
					}
					if (pokemon[index].name === "meowstic") {
					   pokemon[index].name = "meowstic-male";
					}
					if (pokemon[index].name === "wishiwashi") {
					   pokemon[index].name = "wishiwashi-solo";
					}
					if (pokemon[index].name === "wormadam") {
					   pokemon[index].name = "wormadam-plant";
					}
					if (pokemon[index].name === "shaymin") {
					   pokemon[index].name = "shaymin-land";
					}
					if (pokemon[index].name === "basculin") {
					   pokemon[index].name = "basculin-red-striped";
					}
					if (pokemon[index].name === "tornadus") {
					   pokemon[index].name = "tornadus-incarnate";
					}


					if (index === pokemon.length -1){
					   	if(!cachedPokemon[pokemon[index].name]) {
					   				  const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon[index].name}`)
									  	.catch(err => console.log(err));
									  if (data !== undefined) {
									     const pokedata = await data.data;
									     cachedPokemon[pokemon[index].name] = pokedata;
									     await this.setState({
										'pokemonList': this.state.pokemonList.concat(pokedata)});
									     ReactDOM.render(<ColorTable results={this.state.pokemonList}/>, document.querySelector("#container"));
									  }
									  else {
									     ReactDOM.render(<ColorTable results={this.state.pokemonList}/>, document.querySelector("#container"));
									  }
						}
						else {
						     await this.setState({
			     			     'pokemonList': this.state.pokemonList.concat(cachedPokemon[pokemon[index].name])});
						     ReactDOM.render(<ColorTable results={this.state.pokemonList}/>, document.querySelector("#container"));
						}

					}

					else{
						if (!cachedPokemon[pokemon[index].name]) {
						   const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon[index].name}`)
						   	 .catch(err => console.log(err));
						   if (data !== undefined){
						      const pokedata = await data.data;
						      cachedPokemon[pokemon[index].name] = pokedata;
						      await this.setState({
			     			      'pokemonList': this.state.pokemonList.concat(pokedata)});
						   }
						}
						else {
						     await this.setState({ 'pokemonList': this.state.pokemonList.concat(cachedPokemon[pokemon[index].name]) });
						}
					}
					}
					})})
			.catch(err => { console.log(err);
				      	ReactDOM.render(<h2> No results found </h2>, document.querySelector("#container"));
					});

		
    	};


	// get a list of user's team
	getTeam = (e) => {
		axios.get(`http://localhost:4000/api/users/team?id=${this.props.auth.user.id}`)
		.then(res => ReactDOM.render(<TeamTable result={res.data}/>, document.querySelector("#container")));
	}


	// add a pokemon to team
	addPokemon = (name, type, type2, sprite) => {
		   if (type2 !== undefined) {
		      axios.put(`http://localhost:4000/api/users/update?id=${this.props.auth.user.id}&name=${name}&type=${type}&type2=${type2}&sprite=${sprite}`);
		   }
		   else {
		   	axios.put(`http://localhost:4000/api/users/update?id=${this.props.auth.user.id}&name=${name}&type=${type}&sprite=${sprite}`);
		   }
	}


	// remove a pokemon from team and refresh list
	removePokemon = (name) => {
		      axios.put(`http://localhost:4000/api/users/delete?id=${this.props.auth.user.id}&name=${name}`)
		      .then(res => console.log(res.data))
		      .then(this.getTeam());
	}

    
  render() {
    
    return (
    	   <div className="container">
    	   	<h2 className="header"> Search for Pokemon to add to your team </h2>
		<form onSubmit={this.onSearch}>
                    <div className="form-group"> 
                        <label className="label">Search by name: </label>
                        <input  type="text"
                                className="form-control"
                               	id="name"
                                onChange={this.inputHandler}
                                />
                    </div>
		    <div className="form-group">
                        <input type="submit" className="btn btn-primary"/>
                    </div>
                </form>

		<form onSubmit={this.searchByColor}>
                    <div className="form-group"> 
                        <label className="label">Search by color: </label>
                        <input  type="text"
                                className="form-control"
                               	id="color"
                                onChange={this.inputHandler}
                                />
                    </div>
		    <div className="form-group">
                        <input type="submit" className="btn btn-primary"/>
                    </div>
                </form>

		<div id="container"/>

		<div>
			<button
			  style={{
				width: "150px",
                		borderRadius: "3px",
                		letterSpacing: "1.5px",
                		marginTop: "1rem"
              	    	}}
			  onClick={this.getTeam}
			  className="btn btn-large btn-outline-primary white">
			  See my team
			</button>
		</div>
		
		<div className="row justify-content-end">
		    <button
			style={{
				width: "150px",
                		borderRadius: "3px",
                		letterSpacing: "1.5px",
                		marginTop: "1rem"
              	    	}}
              	    	onClick={this.onLogoutClick}
              	    	className="btn btn-large btn-outline-danger white"
            	    >
			Logout
            	    </button>
		</div>
	   </div>
    )
  }
}

const Table = ({results}) => {

  var result = [];
  for(var i in results){
    	    result.push([i, results[i]]); }

  // gather data to send to addPokemon
  var button = [result[10][1], result[15][1][0].type.name];
  if (result[15][1].length > 1) {
     button.push(result[15][1][1].type.name);
  }
  else {
       button.push(undefined);
  }
  button.push(result[13][1].front_default);

 return (
    <table className="table white">
      <thead>
        <tr>
	  <th> Sprite </th>
          <th> Name </th>
          <th> Type </th>
	  <th> Type 2 </th>
	  <th/>
        </tr>
      </thead>
      <tbody>
            <tr>
	      <td> <img src={ result[13][1].front_default } alt="pokemon sprite"/> </td>
              <td> { result[10][1] } </td>
	      <td> { result[15][1][0].type.name } </td>
	      <td> { (result[15][1].length > 1) ? result[15][1][1].type.name : "" } </td>
	      <td> { addButton(button) } </td> 
            </tr>
      </tbody>
    </table>
  );
}

const ColorTable = ({results}) => {

  var result = [];
  var pokenum = 0;

  for(var i in results){
  	  for (var j in results[i]){
	      	  result.push([j, results[i][j]]) }
	  pokenum += 1;
  }  
  
   return dataTable({result}, {pokenum});
   
   
  }

const dataTable = ({result}, {pokenum}) => {

       const rows = [];
       
       for (var count = 0; count < pokenum; count++){
      		  var poke = {};
		  
		  poke.sprite = result[13+(count*17)][1].front_default;
		  poke.name = result[10+(count*17)][1];
		  poke.type = result[15+(count*17)][1][0].type.name;
		  if (result[15+(count*17)][1].length > 1) {
		      poke.type2 = result[15+(count*17)][1][1].type.name;
		  }
		  poke.button = [poke.name, poke.type, poke.type2, poke.sprite];
		  
		  rows.push(poke);
	}

	return <BootstrapTable keyField="name" striped="true" classes="white" data={rows} columns={columns} pagination={ paginationFactory() }/>
}

const TeamTable = ({result}) => {
      const rows = [];

      for (var count in result)
      {
		var poke = {};
		poke.sprite = result[count].sprite;
		poke.name = result[count].name;
		poke.type = result[count].type;
		poke.type2 = result[count].type2;

		poke.button = poke.name;
		rows.push(poke);
      }

      return <BootstrapTable striped="true" classes="white" keyField="name" data={rows} columns={teamColumns} pagination = {paginationFactory() } />
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);