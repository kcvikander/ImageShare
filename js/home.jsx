// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');

var ShareImageHeader = React.createClass({
	render: function () {
		return (
			<div className="share-header">
				<div className="stripe"></div>
				<div className="share-logo">
					<div className="detail"></div>
					<div className="shadow"></div>
					<div className="logo"></div>
				</div>
				<div className="user-name">Welcome, {this.props.userName}.</div>
			</div>
        );
	}
});
var ShareImageFilters = React.createClass({
	getInitialState: function () {
		return {
			showAll: this.props.showAll,
			showFilters: false
		}
	},
	toggleShowAll: function () {
		//this.setState({ showFilters: !this.state.showFilters });
		this.props.data.toggleFunction();
	},
	showAll: function () {
		if (!this.state.showAll) {
			this.props.toggleShowAll();
		}
	},
	showRelevant: function(){
		if (this.state.showAll) {
			this.props.toggleShowAll();
		}
	},
	render: function () {
		var showAllClass = (this.state.showAll) ? "button active" : "button inactive",
			showRelevantClass = (this.state.showAll) ? "button inactive" : "button inactive";
		return (
			<div className="share-filters" >
				<div className="button" onClick={this.toggleShowAll}>
					<i className="fa fa-filter"></i>
				</div>
				<div className={(this.state.showFilters)? "container" : "container hide"}>
					<div className={showAllClass} onClick={this.showAll}>
						<i className="fa fa-star" />
					</div>
					<div className={showRelevantClass} onClick={this.showRelevant}>
						<i className="fa fa-star-o" />
					</div>
				</div>
			</div>
        );
	}
});

var ShareImageFront = React.createClass({
	getInitialState: function () {
		return {
			originalDescription: this.props.params.description,
			description: this.props.params.description,
			isEdit: false
		}
	},
	shareImageClicked: function () {
		window.open('share/share/'+ this.props.params.shortName, '_blank');
	},
	saveEdit: function(){
		//var url = this.props.params.saveUrl + "?shareId=" + this.props.params.shortName + "&field=description&value=" + this.state.description;
		var data = {
			shareId: this.props.params.shortName,
			field: "description",
			value: this.state.description
		}
		$.ajax({
			url: this.props.params.saveUrl,
			dataType: 'text',
			type: 'POST',
			data: JSON.stringify(data),
			success: function (data) {
				this.setState({ isEdit: false, originalDescription: this.state.description });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleDescriptionChange: function (e) {
		this.setState({ description: e.target.value });
	},
	editDescription: function(){
		this.setState({ isEdit: true, newDescription: this.state.originalDescription });
	},
	cancelEdit: function () {
		this.setState({ isEdit: false, description: this.props.params.description });
	},
	render: function () {
		var displayClass = (this.props.params.isFlipped) ? "share-front hide" : "share-front",
			overlayClass= (this.props.params.isHovered) ? "overlay flex" : "overlay hide",
			imgSrc= "/share/api/image/" + this.props.params.shortName + "/small";
		return (
			<div className={displayClass}>
				<div className={overlayClass}>
					<div className="description">
						{(this.state.isEdit) ? "" : this.state.originalDescription }
						<textarea className={(!this.state.isEdit) ? "hide" : ""}
								  value={this.state.newDescription}
								  onChange={this.handleDescriptionChange}
								  maxLength="495"></textarea>
					</div>
					<div className={(this.state.isEdit) ? "hide" : "button"} onClick={this.shareImageClicked}>
						<i className="fa fa-eye"></i>
					</div>
					<div className={(this.state.isEdit) ? "button" : "hide"} onClick={this.saveEdit}>
						<i className="fa fa-floppy-o" />
					</div>
					<div className={(this.state.isEdit) ? "button" : "hide"} onClick={this.cancelEdit}>
						<i className="fa fa-ban" />
					</div>
					<div className={(this.state.isEdit) ? "hide" : "button"} onClick={this.editDescription}>
						<i className="fa fa-pencil" />
					</div>
					<div className={(this.state.isEdit) ? "hide" : "button"} onClick={this.props.params.flipCard} >
						<i className="fa fa-cog"/>
					</div>
				</div>
				<img src={imgSrc} />
			</div>
        );
	}
});

var ShareImageBack = React.createClass({
	render: function () {
		return (
			<div className={(this.props.params.isFlipped) ? "share-back flex" : "share-back hide"}>
				<p>Visibility: {(this.props.params.isPublic) ? <span className="active">Public</span> : <span className="inactive">Internal</span> }</p>
				
				<div className={(this.props.params.isPublic) ? "button active" : "button inactive"} onClick={this.props.params.togglePrivacy}>
					<i className="fa fa-user-secret" />
					{(this.props.params.isPublic) ? "Make Image Private" : "Make Image Public"}
				</div>

				<p>Relevant: {(this.props.params.isRelevant) ? <span className="active">Yes</span> : <span className="inactive">No</span> }</p>
				<div className={(this.props.params.isRelevant) ? "button active" : "button inactive"} onClick={this.props.params.toggleRelevancy}>
					<i className="fa fa-star" />
					{(this.props.params.isRelevant) ? "Archive Image" : "Un-Archive Image"}
				</div>
				<div className="button back" onClick={this.props.params.flipCard}>
					<i className="fa fa-undo" />
					Back
				</div>
			</div>
        );
	}
});

var ShareImageContainer = React.createClass({
    getInitialState: function() {
    	return {
    		ownerId: this.props.image.ownerId,
    		imageId: this.props.image.imageId,
    		isPublic: this.props.image.isPublic,
    		isRelevant: this.props.image.isRelevant,
    		description: this.props.image.description,
    		shortName: this.props.image.shortName,
    		isFlipped: false,
			isHovered: false
    	}
    },
    MouseOverFunc: function () {
    	this.setState({ isHovered: true });
    },
    MouseOutFunc: function () {
    	this.setState({ isHovered: false });
    },
    flipCard: function () {
    	console.log("FLIP CARD");
    	this.setState({ isFlipped: !this.state.isFlipped });
    },
    toggleRelevancy: function () {
    	console.log("toggle relevancy");
    	var data = {
    		shareId: this.props.image.shortName,
    		field: "isRelevant",
    		value: !this.state.isRelevant.toString()
    	}
    	$.ajax({
    		url: this.props.saveUrl,
    		dataType: 'text',
    		type: 'POST',
    		data: JSON.stringify(data),
    		success: function (data) {
    			this.setState({ isRelevant: !this.state.isRelevant });
    		}.bind(this),
    		error: function (xhr, status, err) {
    			console.error(this.props.url, status, err.toString());
    		}.bind(this)
    	});
    },
    togglePrivacy: function () {
    	console.log("toggle privacy");
    	var data = {
    		shareId: this.props.image.shortName,
    		field: "isPublic",
    		value: !this.state.isPublic.toString()
    	}
    	$.ajax({
    		url: this.props.saveUrl,
    		dataType: 'text',
    		type: 'POST',
    		data: JSON.stringify(data),
    		success: function (data) {
    			this.setState({ isPublic: !this.state.isPublic});
    		}.bind(this),
    		error: function (xhr, status, err) {
    			console.error(this.props.url, status, err.toString());
    		}.bind(this)
    	});
    },
    render: function () {
    	var frontObj = {
    			imageId: this.state.imageId,
    			description: this.state.description,
    			shortName: this.state.shortName,
    			isFlipped: this.state.isFlipped,
    			isHovered: this.state.isHovered,
				flipCard: this.flipCard,
				saveUrl: "/share/api/Save"
    		},
			backObj = {
				isPublic: this.state.isPublic,
				isRelevant: this.state.isRelevant,
				isFlipped: this.state.isFlipped,
				toggleRelevancy: this.toggleRelevancy,
				togglePrivacy: this.togglePrivacy,
				flipCard: this.flipCard
			};
    	return (
			<div className="share-container" onMouseOver={this.MouseOverFunc} onMouseOut={this.MouseOutFunc}>
				<ShareImageFront params={frontObj} />
				<ShareImageBack params={backObj} />
			</div>
        );
    }
});

var NoImageSplash = React.createClass({
	render: function () {
		return (
			<div className="no-images">
				<h1>It's lonely in here....</h1>
				<h3>You haven't saved any images yet.</h3>
				<p>Head on over to the Zing homepage to install the extension and get screenshot'n!</p>
			</div>
		);
	}
});

var HomeContainer = React.createClass({
	getInitialState: function() {
		return {
			images: [],
			userName: "",
			showAll: false
		};
	},
	componentDidMount: function () {
		this.getImages();
	},
	getImages: function (showAll) {
		$.ajax({
			url: this.props.url+"?all="+this.state.showAll.toString(),
			dataType: 'json',
			type: 'GET',
			success: function (data) {
				this.setState({ images: data });
				if (data.length > 0) {
					this.setState({ userName: data[0].ownerId })
				}
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	toggleShowAll: function(){
		this.state.showAll = !this.state.showAll;
		this.getImages();
	},
	render: function () {
		var imageNodes = null,
			filterObj = {
				showAll: this.state.showAll,
				toggleFunction: this.toggleShowAll
			};
		if (this.state.images.length > 0) {
			imageNodes = this.state.images.map(function (image) {
				return (
					<ShareImageContainer key={image.imageId} image={image} saveUrl="/share/api/Save" />
				);
			});
		} else {
			imageNodes = <NoImageSplash />;
		}
		
		return (
			<div className="home-container">
				<ShareImageHeader userName={this.state.userName}/>
				<ShareImageFilters data={filterObj} />
				<div className="image-list">
				{imageNodes}
				</div>
			</div>
			
		);
	}
});

ReactDOM.render(
  <HomeContainer url="/share/api/AllImages" />,
  document.getElementById('react')
);