// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');

var ShareImageDescription = React.createClass({
	getInitialState: function() {
		return {
			description: ""
		};
	},
	componentDidMount: function() {
		$.ajax({
		    url: this.props.url,
		    dataType: 'text',
		    type: 'GET',
		    success: function(data) {
		    	this.setState({ description: data });
		    }.bind(this),
		    error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		    }.bind(this)
		});
	},
	render: function() {
		return (
			<div className="share-image-detail">
				<p>{this.state.description}</p>
			</div>
		);
	}
});

var ShareImage = React.createClass({
	getInitialState: function () {
		var split = location.pathname.toLowerCase().split("/");
        return {
        	imageId: split[split.length - 1]
        };
    },
	render: function() {
		return (
			<div className="content">
				<div className="share-image-container">
					<img src={this.props.url + "/" + this.state.imageId} />
				</div>
				<ShareImageDescription url={this.props.url + "/" + this.state.imageId + "/description"} />
			</div>
		);
	}
});

ReactDOM.render(
	<ShareImage url="/share/api/image" />,
	document.getElementById('react')
);