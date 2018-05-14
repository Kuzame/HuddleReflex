import React, { Component } from 'react';
import { NavBoard } from './Nav.js';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import firebase, { auth } from './firebase.js';

// use shortid.generate() to generate a unique ID for our boards
var shortid = require('shortid');

class BoardTile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTools: false,
      showRenameForm: false,
			showShareForm: false
		}

		// binds certain functions so the "this" keyword knows what to refer to
		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
		this.share = this.share.bind(this);
		this.delete = this.delete.bind(this);
		this.unlink = this.unlink.bind(this);
		this.rename = this.rename.bind(this);
    this.renameSubmit = this.renameSubmit.bind(this);
		this.shareSubmit = this.shareSubmit.bind(this);
	}

	onMouseEnterHandler() {
		// set the showTools state to true when this function is triggered:
		// when cursor enters the board tile
		this.setState({ showTools: true });
	}

	onMouseLeaveHandler() {
		// set the showTools state to false when this function is triggered:
		// when cursor leaves the board tile div (including board tile and tool bar)
		this.setState({ showTools: false });
	}

	rename() {
    // when called, passes the name of the button to the dashboard component
    // to be renamed
    this.setState({ showRenameForm: !this.state.showRenameForm });
    //this.props.onRename(this.props.uid, this.props.name);
	}

  renameSubmit = (newName) => {
    this.props.onRename(this.props.uid, newName);
    this.setState({ showRenameForm: false });
  }

	share (){
		this.setState({showShareForm: !this.state.showShareForm});
	}

	shareSubmit = (emailToShare, share_uid, share_name) => {
		this.props.onShare(emailToShare, this.props.uid, this.props.name);
		this.setState({showShareForm: false});

	}

	unlink() {
		this.props.onUnlink(this.props.uid);
	}

	delete() {
		// when called, passes the name of the button to the dashboard component
		// to be deleted
		this.props.onDelete(this.props.uid);
	}

	render() {
		// create a string to link to particular board
		// ex: board/myfirstboard if the name of the board is "myfirstboard"
		var boardLink = "board/" + this.props.uid;

		// if state.showTools is true, then render BoardTileTools component
		// if not, only render the main button
		return(
			<div class="col-12 col-sm-6 col-lg-3 board-tile" onMouseLeave={this.onMouseLeaveHandler}>
				<Link to={boardLink} className="btn btn-primary btn-lg btn-block project-btn board-btn"
					onMouseEnter={this.onMouseEnterHandler}>
					{this.props.name}
				</Link>
        {this.state.showRenameForm && <RenameForm onSubmit={newName => {this.renameSubmit(newName)}} />}
        {this.state.showShareForm && <ShareForm onSubmit={(emailToShare, share_uid, share_name) => {this.shareSubmit(emailToShare, share_uid, share_name)}} />}
        {this.state.showTools && <BoardTileTools onUnlink={this.unlink} onShare={this.share} onRename={this.rename} onDelete={this.delete} shareShow={this.state.showShareForm} renameShow={this.state.showRenameForm} />}
			</div>
		)
	}
}

class BoardTileTools extends Component {
	constructor(props){
		super(props);
		this.rename = this.rename.bind(this);
		this.share  = this.share.bind(this);
		this.unlink = this.unlink.bind(this);
		this.delete = this.delete.bind(this);
    this.state = {
      renameFormOpen: false,
			shareFormOpen: false,
      renameButtonTitle: "Rename Board",
      renameFormClasses: "fa fa-pencil",
			shareButtonTitle: "Share Board",
      shareFormClasses: "fa fa-pencil",
    }
	}

  componentDidMount() {
    // ternary operator: if renameShow is true, execute 1st line, else execute 2nd line
    (this.props.renameShow)
      ? this.setState({ renameButtonTitle: "Close Rename Form", renameFormClasses: "fa fa-times"})
      : this.setState({ renameButtonTitle: "Rename Board", renameFormClasses: "fa fa-pencil"});


    (this.props.shareForm)
      ? this.setState({ shareButtonTitle: "Close Share Form", shareFormClasses: "fa fa-times"})
      : this.setState({ shareButtonTitle: "Share Board", shareFormClasses: "fa fa-pencil"});

  }

	rename() {
		// opens rename form when rename button is clicked
    this.props.onRename();
    this.setState({ renameFormOpen: !this.state.renameFormOpen }, function() {
      // ternary operator: if renameShow is true, execute 1st line, else execute 2nd line
      (this.props.renameShow)
        ? this.setState({ renameButtonTitle: "Close Rename Form", renameFormClasses: "fa fa-times"})
        : this.setState({ renameButtonTitle: "Rename Board", renameFormClasses: "fa fa-pencil"});
    });

	}

	// Implementing the share functionality
	share() {

		this.props.onShare();
		this.setState({shareFormOpen: !this.state.shareFormOpen }, function () {
			(this.props.shareShow)
        ? this.setState({ shareButtonTitle: "Close Share Form", shareFormClasses: "fa fa-times"})
        : this.setState({ shareButtonTitle: "Share Board", shareFormClasses: "fa fa-pencil"});
		})

		// // Grabbing the user's friend's email
		// var emailToShare = prompt("Please enter your friend's email: ");
		// if (emailToShare == null || emailToShare == "") {
		// 	return;
		// }
    //
		// // call onShare (share) function of the parent BoardTile when delete button is clicked
		// this.props.onShare(emailToShare);

	}

	unlink() {
		// call onUnlink function of the parent BoardTile when delete button is clicked
		this.props.onUnlink();
		//console.log("I want to unlink");
	}

	delete() {
		// call onDelete function of the parent BoardTile when delete button is clicked
		this.props.onDelete();
	}

	render() {
		return(
			<div class="dashboard-board-tools">
				<BoardTileToolButton onClick={this.rename} title={this.state.renameButtonTitle} classes={this.state.renameFormClasses}/>
				<BoardTileToolButton onClick={this.share} title={this.state.shareButtonTitle} classes={"fa fa-share-alt"}/>
				<BoardTileToolButton onClick={this.unlink} title={"Unlink From Board"} classes={"fa fa-chain-broken"}/>
				<BoardTileToolButton onClick={this.delete} title={"Delete Board"} classes={"fa fa-trash"}/>
			</div>
		)
	}
}

class BoardTileToolButton extends Component {
	render() {
		return(
			<button class="tool-btn" onClick={this.props.onClick} title={this.props.title}>
				<i className={this.props.classes} aria-hidden="true"></i>
			</button>
		)
	}
}

class RenameForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
		this.state = {
      renameInput: '',
      invalidInput: false
    }
	}

	componentDidMount() {
		// is called as soon as this component is rendered.
		// adds focus to the input box so the user doesn't have to click on it to type
		this.newFormInput.focus();
	}

  // fat arrow function, pass "e" variable into the function
  // "e" variable is the "event", in this case a click event
  onSubmit = (e) => {
    e.preventDefault();
    if (this.checkValidity(this.state.renameInput)) {
      this.setState({ invalidInput: false });
      this.props.onSubmit(this.state.renameInput);
    }
    else {
      this.setState({ invalidInput: true });
      //console.log("Invalid rename: ", this.state.renameInput);
    }
    // this.props.onSubmit(this.state.renameInput);
  }

  checkValidity(nameToCheck) {
		// returns true if name contains only letters, numbers, spaces, dashes, underscores
		// returns false if name contains any other special characters
		return(!(/[^A-Za-z0-9_-\s]/.test(nameToCheck)));
	}

  render() {
    return(
      <div id="rename-board-form">
        <form>
          { this.state.invalidInput &&
            <label htmlFor="rename-board-name" id="invalidInputLabel">
              No special characters except <strong>-</strong> and <strong>_</strong>.
            </label>
          }
          <input type="text" class="form-control" value={this.state.renameInput}
            onChange={e => this.setState({ renameInput: e.target.value}) }
            ref={input => { this.newFormInput = input }} id="rename-board-name"
            placeholder="Rename Your Board" />
            <button onClick={e => this.onSubmit(e)} id="submit-rename-btn">
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </form>
      </div>
    )
  };
}

class ShareForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
		this.state = {
      emailToShare: '',
      invalidInput: false
    }
	}

	componentDidMount() {
		// is called as soon as this component is rendered.
		// adds focus to the input box so the user doesn't have to click on it to type
		this.newFormInput.focus();
	}

  // fat arrow function, pass "e" variable into the function
  // "e" variable is the "event", in this case a click event
  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.emailToShare) {
      this.setState({ invalidInput: false });
      this.props.onSubmit(this.state.emailToShare);
    }
    else {
      this.setState({ invalidInput: true });
      //console.log("Empty email: ", this.state.emailToShare);
    }
    // this.props.onSubmit(this.state.renameInput);
  }

  render() {
    return(
      <div id="rename-board-form">
        <form>
          { this.state.invalidInput &&
            <label htmlFor="rename-board-name" id="invalidInputLabel">
              No special characters except <strong>-</strong> and <strong>_</strong>.
            </label>
          }
          <input type="text" class="form-control" value={this.state.emailToShare}
            onChange={e => this.setState({ emailToShare: e.target.value}) }
            ref={input => { this.newFormInput = input }} id="rename-board-name"
            placeholder="Enter email to share" />
            <button onClick={e => this.onSubmit(e)} id="submit-rename-btn">
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </form>
      </div>
    )
  };
}


// This is the button to create a new board; only used once
class NewBoardTile extends Component {
	constructor(props) {
		super(props);
		this.state = {isOpen: false}; // state isOpen refers to the NewBoardForm
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (boardName) => {
		// when called,
		this.props.onSubmit(boardName);
	};

	toggleForm() {
		// flips the state value (true->false, false->true)
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	// render the "create new board" tile.
	// if this.state.isOpen == true, also render the "new board form"
	render() {
		return(
			<div class="col-12 col-sm-6 col-lg-3">
				{this.state.isOpen && <NewBoardForm show={this.state.isOpen} onClose={this.toggleForm.bind(this)} onSubmit={boardName => { this.onSubmit(boardName) }} />}
				<button class="btn btn-secondary btn-block btn-lg mb-5 project-btn" id="new-board-btn" onClick={this.toggleForm.bind(this)}>Create New Board</button>
			</div>
		)
	}
}

class NewBoardForm extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.state = { boardName: '' }
	}

	componentDidMount() {
		// is called as soon as this component is rendered.
		// adds focus to the input box so the user doesn't have to click on it to type
		this.newFormInput.focus();
	}

	checkValidity(nameToCheck) {
		// returns true if name contains only letters, numbers, spaces, dashes, underscores
		// returns false if name contains any other special characters
		return(!(/[^A-Za-z0-9_-\s]/.test(nameToCheck)));
	}

	onSubmit = (e) => {
		e.preventDefault(); // prevents default action of reloading the page on form submit
		if (this.checkValidity(this.state.boardName)) {
			this.props.onSubmit(this.state.boardName.trim()); // calls prop onSubmit function, passing it the value in the input field
			this.props.onClose();	// when submitting the form, this calls the "onClose" prop method of "NewBoardTile.toggleform()"
		}
		else {
			// the name is not valid, turns the warning text red so they notice it more
			//console.log("This name is not valid: ", this.state.boardName, "\nPlease remove special characters.")
			this.warningText.style.color = "red";
		}
	}

	render() {
		if(!this.props.show) {
			return null;
		}

		return(
			<div id="new-board-form" class="col-12">
				<button class="close-button" onClick={this.props.onClose.bind(this)}>&times;</button>
				<form>
					<h5 style={{borderBottom: "1px solid black", display: "inline-block"}}>Start A New Board</h5>
					<p>Use this simple form to create a new board. You can always change the name and other settings later.</p>
					<div class="form-group">
						<p ref={warning => { this.warningText = warning }} style={{fontSize: "0.75rem"}}>Please use only letters, numbers, dashes and underscores.</p>
						<label htmlFor="new-board-name">New Board Name:</label>
						<input type="text" class="form-control" value={this.state.boardName}
							onChange={e => this.setState({ boardName: e.target.value}) }
							ref={input => { this.newFormInput = input }} id="new-board-name" placeholder="Name Your Board" />
					</div>
					<button onClick={e => this.onSubmit(e)} class="btn btn-primary">Create Board</button>
				</form>
			</div>
		)
	}
}

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			newBoard: false,

			newBoards: [],
			boardObjects: [],
			userID: null,
			userName: null,
			user: [],
			uidList: []

		};
		// newBoards is an array of just the names of the boards (for convenience)
		// boardObjects is an array of objects that contain the names and React DOM info of each boardObjects
		// note: the board tiles are actually rendered from boardObjects, not from newBoards
		// newBoards is used for easy updates. boardObjects is then updated based on the names in newBoards

    // when connected to database, here we can send user id to database
    // in order to retrieve json file with list of boards, then set state
		//this.onNewBoardSubmit = this.onNewBoardSubmit.bind(this);
	}
	componentWillMount() {
		auth.onAuthStateChanged((user) => {
		  if (!user) {//user is not logged in
			this.props.history.push('/login');
		  }
		});
	}

	componentDidMount() {
		// on component load: changes tab name and updates state.boardObjects
		document.title = "Huddle Dashboard";
		auth.onAuthStateChanged((userAuth) => {
				if (userAuth) { //note that we cannot simply assign "user: userAuth" because object cannot be passed
				this.setState({user: userAuth});
				// fetches the object referencing the list of personalBoards of the current user
				var getData = firebase.database().ref('listOfUsers/'+this.state.user.uid+'/personalBoards');
				var updating=false;
				// fetches a snapshot (kinda like a constant camera watching the database)
				// It will set the current State to update the newBoards with all the contents that the user
				// might have. From there it will push all the contents to this.state.newBoards so that
				// updateBoards() will create all the board components on the dashboards accordingly
				getData.once("value", function(snapshot) { //this will enable us to access & browse listOfUsers/{user's ID}/personalBoards
					var changedPost = snapshot.val();
					this.setState({newBoards: []}, function() {
						for (var i in changedPost) {
							var test = firebase.database().ref('listOfBoards/'+changedPost[i].uid);
							test.once("value", function(snapshot) {//this will enable us to browse listOfBoards/{the item's ID}
								//console.log("test"); //apparently, this page will UPDATE itself if there's any changes in snapshot's path
								if(snapshot.val()){ //so that it doesn't execute if we delete the board/item
								//console.log(snapshot.val());
									this.state.newBoards.push({name: snapshot.val().boardName, uid: snapshot.val().uid});
								}
								this.updateBoards();
								//console.log(this.state.newBoards);
							}.bind(this));
							//console.log(test);
						}
					});
					//this.updateBoards();
				}.bind(this));
			}
		});
	}

	getBoard() {
		this.updateBoards();
	}

	onNewBoardSubmit = (boardName) => {
		// when newBoardForm is submitted: updates state, adds new board name,
		// then updates state.boardObjects
		this.setState({ newBoard: true });

		// Add the new board to the list of boards
		var uid = shortid.generate();
		// var userBoardUid = shortid.generate();
		this.state.newBoards.push({name: boardName, uid: uid});

		// Create a database reference object -- for listOfBoards
		var boardNamesRef = firebase.database().ref('listOfBoards/'+uid);
		// Create a database reference object -- for listOfUsers
		var boardNamesRefUser = firebase.database().ref('listOfUsers/'+this.state.user.uid+'/personalBoards/'+uid);

		// Creates a board instance that will be pushed into the database. (key, value) format
		const boardList = {
			boardName: boardName,
			masterUser: this.state.user.uid,
			userId: [this.state.user.uid],
			uid: uid,
			columns: [
				{columnName: 'Backlog', cards: []},
				{columnName: 'In Progress', cards: []},
				{columnName: 'Complete', cards: []}
			]
		}

		// --------- THIS is where you update/push data into the database --------
		// Use the reference object's push function to push the state to FBDB
    // this is the unique key from firebase
    // console.log(a.path.pieces_[1]);

		// Note that boardNamesRef has uid appended. Therefore it will be updating the db with a
		// new boardList instance within the listOfBoards (db).
		boardNamesRef.set(boardList);

		// Creates a specific instance for the user personalBoards
		const userBoardList = {
			boardName: boardName,
			uid: uid
		}

		// Pushing said instance to the current user's personalBoards. Note that boardNamesRefUser
		// conatins a special userBoardUid. This behavior is the same as boardNamesRef.set(...)
		boardNamesRefUser.set(userBoardList);

		// We want to make sure that the front end aspects are updated accordingly
		this.updateBoards();
	}

	updateBoards() {
		// look at this.state.newBoards, map the names to variable "boards"
		// basically creates an array? of objects with one <BoardTile> for each name in newBoards
		var boards = this.state.newBoards.map(function({name, uid}, index) {
			return(<BoardTile name={name} key={index} uid={uid} onShare={(emailToShare, share_uid, share_name) => {this.shareBoard(emailToShare, share_uid, share_name)}} onDelete={this.deleteBoard.bind(this, uid)} onUnlink={this.unlinkBoard.bind(this, uid)}
        onRename={(uid, newName) => {this.renameBoard(uid, newName)}}/>)
		}.bind(this));

		// new array to store each object in
		var myBoards = [];

		// for each item in "boards" variable, add it to the "myBoards" array
		boards.forEach(function(item, key) {
			myBoards.push(item);
		})

		// sets state.boardObjects to be "myBoards", new list of objects
		this.setState({ boardObjects: myBoards }, function() {
		// prints new boardObjects state to console, AFTER update is done
		});
	}

	shareBoard(emailToShare, share_uid, share_name) {

			const currentUid = share_uid; 	// Keeps track of the board's uid that is being shared
			const currentBoardName = share_name;  // Keeps track of the board's name that is being shared
			var previousLength = 0; // Temporary variable for the following loop
			// Create a database reference object -- for listOfUsers
			var refUser = firebase.database().ref('listOfUsers/');

			// Creating a promise with a resolve and reject states.
			// Please refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
			new Promise((resolve, reject) => {
				// Creation of a snapshot to fetch the latest data of refUser
				refUser.once("value", function(snapshot) {
					var currObject = snapshot.val();

					// A little hack I came up with so that we don't delete a null state or anything of that sort.
					if (!currObject) {
						reject("NULL Object");
						return;
					}

					var found = false;
					// Looping through all of the keys in currObject
					for (var i in currObject) {
						//console.log("Outside of IF function, currObject\[",i,"\]", currObject[i]);
						// Once we find one, execute it
						if (currObject[i]['userEmail'] == emailToShare) {
							const foundUserId = currObject[i]['user'];	// Keeps track of the found user's id
							var refUserFound = firebase.database().ref('listOfUsers/'+foundUserId+'/personalBoards/'+currentUid);  // Reference to the found user's information

							// Creating an new Board object for the found user to append to
							const userBoardRef = {
								boardName: currentBoardName,
								uid: currentUid
							}
								//console.log("refUserFound: ", refUserFound," + userBoardRef", userBoardRef);

							refUserFound.set(userBoardRef); // Updating the found user

							// Adding to the current board itself (db)
							// Create a database reference object -- for listOfBoards
							var refBoard = firebase.database().ref('listOfBoards/'+currentUid);  // Reference to the list of board of the shared board in question

							//--------------------------------------------
							refBoard.once("value", function(snapshot) {		// Creating a snapshot of the current state
								var refBoardCurr = snapshot.val();
								var currentUserIdList = refBoardCurr['userId'];
              //
							// 	// This is a small little hack to prevent the state being pushed in indefinitely
							// 	if (previousLength === 0) {
							// 		previousLength = currentUserIdList.length;
							// 	}
							// 	else if (currentUserIdList.length > previousLength) {
							// 		return;
							// 	}
              //
							// 	// Adding the sharing user to the list
								currentUserIdList.push(foundUserId);
								//console.log(currentUserIdList, foundUserId);

								refBoard = firebase.database().ref('listOfBoards/'+currentUid+'/userId');
								refBoard.update(currentUserIdList);
								//console.log(currentUserIdList, foundUserId);
              //
							// 	// Creating an updated version of the Board
							// 	const newUserIdList = {
							// 		boardName: refBoardCurr['boardName'],
							// 		masterUser: refBoardCurr['masterUser'],
							// 		userId: currentUserIdList
							// 	}
              //
							// 	refBoard.set(newUserIdList); // Updates the Board
							// 	resolve("Shared Board works properly");
							// 	return;
							})
							//-----------------------------------------

						}
					}
				}.bind(this))
			}).then((successMessage) => {
				//console.log(successMessage);
			}).catch((err) => {
				//console.log(err);
				//console.log("FUCK That's not supposed to happen");
			})


	}

	//was copy pasted from deleteBoard, therefore it is identical except one line
	unlinkBoard(uid) {
		// creates new variable boardNamesTemp to do all the delete work in
		var boardNamesTemp = this.state.newBoards;

		// finds the index of the "uid" parameter in the array
		var deleteTileIndex = -1;
    boardNamesTemp.forEach((board, index) => {
      if (board.uid === uid) {
        deleteTileIndex = index;
      }
    });
    if (deleteTileIndex === -1) {
      //console.log("Something went wrong with the ID's in deleteBoard");
      //console.log("uid not found: ", uid);
    }

		// removes the corresponding element from the array
		boardNamesTemp.splice(deleteTileIndex, 1);

		// sets state.newBoards to be equal to new array with deleted item
		this.setState({ newBoards: boardNamesTemp });

		// Create a database reference object -- for listOfBoards
		var boardNamesRef = firebase.database().ref('listOfBoards/'+uid+"/userId");
		//console.log(boardNamesRef);

		// Creating a promise with a resolve and reject states.
		// Please refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
		new Promise((resolve, reject) => {
			// Creation of a snapshot to fetch the latest data of boardNamesRef
			boardNamesRef.on("value", function(snapshot) {
				var currObject = snapshot.val();

				// A little hack I came up with so that we don't delete a null state or anything of that sort.
				if (!currObject) {
					reject("NULL Object");
					return;
				}

				// Create a database reference object -- for listOfUsers
				for (var i in currObject) {
					var boardNamesRefUser = firebase.database().ref('listOfUsers/'+currObject[i]+'/personalBoards/'+uid);
						//console.log("Debugging: "+ i + " =  "+ currObject[i] );
					if (this.state.user.uid === currObject[i]) {
						// Literally deletes the instance declared right above
						boardNamesRefUser.remove();
						// Sets the resolved state's message
						//console.log("Debugging2: "+ i + " =  "+ currObject[i] );
						resolve("Unlink of UserUi: " + currObject[i] + " successful");
						boardNamesRef = firebase.database().ref('listOfBoards/'+uid+'/userId/'+i);

						// Literally deletes the boardNamesRef instance from the db upon the Promises completing
						boardNamesRef.remove();
					}
				}

			}.bind(this)) // Make sure that it's referring to the correct this
		}).then((successMessage) => {
			// executing the resolve state only when the current promise is completed.
			//console.log(successMessage); // prints out the resolve state's successMessage

			// Literally deletes the boardNamesRef instance from the db upon the Promises completing
			boardNamesRef.remove();
		}).catch((err) => {
			//console.log(err);

			//console.log("FUCK That's not supposed to happen");
		})

		// updates state.boardObjects based on the newBoards array
		this.updateBoards();
	}

	deleteBoard(uid) {
		// creates new variable boardNamesTemp to do all the delete work in
		var boardNamesTemp = this.state.newBoards;

		// finds the index of the "uid" parameter in the array
		var deleteTileIndex = -1;
    boardNamesTemp.forEach((board, index) => {
      if (board.uid === uid) {
        deleteTileIndex = index;
      }
    });
    if (deleteTileIndex === -1) {
      //console.log("Something went wrong with the ID's in deleteBoard");
      //console.log("uid not found: ", uid);
    }

		// removes the corresponding element from the array
		boardNamesTemp.splice(deleteTileIndex, 1);

		// sets state.newBoards to be equal to new array with deleted item
		this.setState({ newBoards: boardNamesTemp });

		// Create a database reference object -- for listOfBoards
		var boardNamesRef = firebase.database().ref('listOfBoards/'+uid+'/userId');
		//console.log(boardNamesRef);

		//console.log(uid);
		// Creating a promise with a resolve and reject states.
		// Please refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
		new Promise((resolve, reject) => {
			// Creation of a snapshot to fetch the latest data of boardNamesRef
			boardNamesRef.on("value", function(snapshot) {
				var currObject = snapshot.val();

				// A little hack I came up with so that we don't delete a null state or anything of that sort.
				if (!currObject) {
					reject("NULL Object");
					return;
				}

				// Create a database reference object -- for listOfUsers
				for (var i in currObject) {
					// console.log("inForLoop: ", 'listOfUsers/'+currObject[i]+'/personalBoards/'+uid);
					var boardNamesRefUser = firebase.database().ref('listOfUsers/'+currObject[i]+'/personalBoards/'+uid);

					// Literally deletes the instance declared right above
					boardNamesRefUser.remove();
					// Sets the resolved state's message
					// resolve("Deletion of UserUi: " + currObject[i] + " successful");
				}
				boardNamesRef = firebase.database().ref('listOfBoards/'+uid);
				//console.log(uid);
				boardNamesRef.remove();

			}) // Make sure that it's referring to the correct this
		}).then((successMessage) => {
			// executing the resolve state only when the current promise is completed.
			//console.log(successMessage); // prints out the resolve state's successMessage

			// Literally deletes the boardNamesRef instance from the db upon the Promises completing

		}).catch((err) => {
			//console.log(err);

			//console.log("FUCK That's not supposed to happen");
		})

		// updates state.boardObjects based on the newBoards array
		this.updateBoards();
	}

	renameBoard(uid, newName) {
		// to be used for renaming the board, currently not functional
    var boardNamesTemp = this.state.newBoards;
    var renameTileSuccess = 0;
    boardNamesTemp.forEach((board, index) => {
      if (board.uid === uid) {
        board.name = newName;
        renameTileSuccess = 1;
      }
    });
		//console.log("from renameBoard: ", uid, newName);
		//----This is the part where we update our changes into the database---
		var renameRef = firebase.database().ref('listOfBoards/'+uid);
		renameRef.update({boardName: newName});
		//---------------------------------------------------------------------

    if (!renameTileSuccess) {
      //console.log("Something went wrong, rename failed. ", uid);
    }
    this.updateBoards();

	}

	render() {
		// { this.state.boardObjects } returns a list of all <BoardTile> elements
		// that are stored in boardObjects and renders them
		return(
			<div>
				<NavBoard user={this.state.user}/>
				<div class="container">
					<h3 class="mt-5 mb-4"><i class="fa fa-user-o mr-2" aria-hidden="true"></i> {this.state.user.displayName} Boards</h3>
					<div class="row" id="personal-boards">
						{ this.state.boardObjects }
						<NewBoardTile onSubmit={boardName => { this.onNewBoardSubmit(boardName) }}/>
					</div>
				</div>
			</div>
		)
	}
}

export { BoardTile, Dashboard };
