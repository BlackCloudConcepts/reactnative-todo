var React = require('react-native');
var {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView
} = React;

class blkcldList extends Component {
  // Your App Code
  constructor(props) {
    super(props);
    this.props = props;
    var _this = this;

    var myFirebaseRef = new Firebase('https://blkcldtodo.firebaseio.com/');

    // !!! move me to a login screen
    myFirebaseRef.authWithPassword({
      email    : this.props.user.username,
      password : this.props.user.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        _this.itemsRef = myFirebaseRef.child('items');

        _this.postAuth();
      }
    });

    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };

    this.items = [];

  }

  componentDidMount() {
    // called after render is complete

  }

  postAuth() {
    // When a todo is added
    this.itemsRef.on('child_added', (dataSnapshot) => {
      this.items.push({id: dataSnapshot.key(), text: dataSnapshot.val()});
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });

    // When a todo is removed
    this.itemsRef.on('child_removed', (dataSnapshot) => {
        this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
        this.setState({
          todoSource: this.state.todoSource.cloneWithRows(this.items)
        });
    });
  }

  addTodo() {
    if (this.state.newTodo !== '') {
      this.itemsRef.push({
        todo: this.state.newTodo
      });
      this.setState({
        newTodo : ''
      });
    }
  }

  removeTodo(rowData) {
    this.itemsRef.child(rowData.id).remove();
  }

  render() {
    return (
      <View style={this.props.styles.appContainer}>
        <View style={this.props.styles.inputcontainer}>
          <TextInput style={this.props.styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
          <TouchableHighlight
            style={this.props.styles.button}
            onPress={() => this.addTodo()}
            underlayColor='#dddddd'>
            <Text style={this.props.styles.btnText}>Add</Text>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.todoSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View>
          <View style={this.props.styles.row}>
            <Text style={this.props.styles.todoText}>{rowData.text.todo}</Text>
            <Text
              onPress={() => this.removeTodo(rowData)}>
              X
            </Text>
          </View>
          <View style={this.props.styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = blkcldList;
