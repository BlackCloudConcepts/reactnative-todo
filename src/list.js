var React = require('react-native');
var {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
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

        _this.itemsRef = myFirebaseRef.child(_this.props.type);

        _this.postAuth();
      }
    });

    this.styles = {
      backgroundColorNormal: '#ffffff',
      backgroundColorSelected: '#993344'
    };

    this.state = {
      newItem: '',
      itemSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };

    this.items = [];

  }

  componentDidMount() {
    // called after render is complete

  }

  postAuth() {
    // When a todo is added
    this.itemsRef.on('child_added', (dataSnapshot) => {
      var val = dataSnapshot.val();
      if (val.selected){
        val.backgroundColor = this.styles.backgroundColorSelected;
      } else {
        val.backgroundColor = this.styles.backgroundColorNormal;
      }
      this.items.push({id: dataSnapshot.key(), text: val});
      this.setState({
        itemSource: this.state.itemSource.cloneWithRows(this.items)
      });
    });

    this.itemsRef.on('child_changed', (dataSnapshot) => {
      // console.log(this.items);
      // this.items.push({id: '123', text: {desc: 'anything', selected: false}})
      for (var i = 0;i < this.items.length;i++){
        if (dataSnapshot.key() === this.items[i].id){
          this.items[i].text.selected = dataSnapshot.val().selected;
          if (this.items[i].text.selected){
            this.items[i].text.backgroundColor = this.styles.backgroundColorSelected;
          } else {
            this.items[i].text.backgroundColor = this.styles.backgroundColorNormal;
          }
          // this.items[i].forceUpdate = Math.random();
        }
      }
      // !!! This is wrong, but seems to be the only way for force a re-render
      // - guessing this is because of a deep change in the object not picked up by react
      // - tried using this.forceUpdate()
      // - tried changing a value at the root of the object with forceUpdate and a random number above
      this.setState({
        itemSource: this.state.itemSource.cloneWithRows([])
      });
      this.setState({
        itemSource: this.state.itemSource.cloneWithRows(this.items)
      });
      // this.forceUpdate();
    });

    // When a todo is removed
    this.itemsRef.on('child_removed', (dataSnapshot) => {
        this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
        this.setState({
          itemSource: this.state.itemSource.cloneWithRows(this.items)
        });
    });
  }

  addTodo() {
    if (this.state.newItem !== '') {
      this.itemsRef.push({
        desc: this.state.newItem,
        selected: false
      });
      this.setState({
        newItem : ''
      });
    }
  }

  removeTodo(rowData) {
    this.itemsRef.child(rowData.id).remove();
  }

  rowSelect(rowData) {
    if (rowData.text.selected){
      // removed - instead updating Firebase and letting the change events from there update this.items
      // for (var i = 0;i < this.items.length; i++){
      //   if (this.items[i].id === rowData.id){
      //     this.items[i].text.selected = false;
      //     this.items[i].text.backgroundColor = this.styles.backgroundColorNormal;
      //   }
      // }
      this.itemsRef.child(rowData.id).update({ selected: false });
    } else {
      // removed - instead updating Firebase and letting the change events from there update this.items
      // for (var i = 0;i < this.items.length; i++){
      //   if (this.items[i].id === rowData.id){
      //     this.items[i].text.selected = true;
      //     this.items[i].text.backgroundColor = this.styles.backgroundColorSelected;
      //   }
      // }
      this.itemsRef.child(rowData.id).update({ selected: true });
    }
  }

  render() {
    return (
      <View style={this.props.styles.appContainer}>
        <View style={this.props.styles.inputcontainer}>
          <TextInput style={this.props.styles.input} onChangeText={(text) => this.setState({newItem: text})} value={this.state.newItem}/>
          <TouchableHighlight
            style={this.props.styles.button}
            onPress={() => this.addTodo()}
            underlayColor='#dddddd'>
            <Text style={this.props.styles.btnText}>Add</Text>
          </TouchableHighlight>
        </View>
        <ListView
          contentInset={{bottom:70}}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.itemSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View>
          <View
            style={[this.props.styles.row, {backgroundColor: rowData.text.backgroundColor}]}>
            <Text
              onPress={() => this.rowSelect(rowData)}
              style={this.props.styles.todoText}>
              {rowData.text.desc}
            </Text>
            <Text
              onPress={() => this.removeTodo(rowData)}>
              Del
            </Text>
          </View>
          <View style={this.props.styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = blkcldList;
