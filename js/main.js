var ReactFormInput = React.createClass({
	getInitialState: function(){
		return {
			name: this.props.name
		}
	},
	onChange: function(event){
		this.props.onChange(this.props.id, event.currentTarget.value);
	},
	render: function(){
		return (
			<div className="control-container">
				<label id="{this.state.name}" name="{this.state.name}">{this.state.name}</label><br />
				<input type="text" id="{this.props.id}" onChange={this.onChange}/>
			</div>
		);
	}

});

var TestForm = React.createClass({
	getInitialState: function(){
		return {
			name: "",
			gender: ""
		}
	},
	onChange: function(id, newValue) {
		this.setState({[id]:newValue});
	},
	render: function () {
		return (
			<div className="form-container">
				Hello world!!  Your name is: {this.state.name}
				<ReactFormInput id="name" name="User Name" onChange={this.onChange} />
			</div>
		);
	}
});

ReactDOM.render(
  <TestForm />,
  document.getElementById('react')
);