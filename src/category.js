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

class blkcldCategory extends Component {
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

        _this.itemsRef = myFirebaseRef.child('categories');

        _this.postAuth();
      }
    });

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
      this.items.push({id: dataSnapshot.key(), text: val});
      this.setState({
        itemSource: this.state.itemSource.cloneWithRows(this.items)
      });
    });

    // When a todo is removed
    this.itemsRef.on('child_removed', (dataSnapshot) => {
        this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
        this.setState({
          itemSource: this.state.itemSource.cloneWithRows(this.items)
        });
    });
  }

  addCategory() {
    if (this.state.newItem !== '') {
      this.itemsRef.push({
        desc: this.state.newItem
      });
      this.setState({
        newItem : ''
      });
    }
  }

  removeCategory(rowData) {
    this.itemsRef.child(rowData.id).remove();
  }

  selectCategory(rowData) {
    var title = '';
    for (var i = 0;i < this.items.length;i++){
      if (rowData.id === this.items[i].id){
        title = rowData.text.desc;
      }
    }
    this.props.navigator.push({
      title: title,
      component: this.props.components.blkcldList,
      passProps: {
        components: this.props.components,
        styles: this.props.styles,
        user: this.props.user,
        type: title
      }
    });
  }

  render() {
    return (
      <View style={this.props.styles.appContainer}>
        <View style={this.props.styles.inputcontainer}>
          <TextInput style={this.props.styles.input} onChangeText={(text) => this.setState({newItem: text})} value={this.state.newItem}/>
          <TouchableHighlight
            style={this.props.styles.button}
            onPress={() => this.addCategory()}
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
            style={this.props.styles.row}>
            <Text
              onPress={() => this.selectCategory(rowData)}
              style={this.props.styles.todoText}>
              {rowData.text.desc}
            </Text>
            <Text
              onPress={() => this.removeCategory(rowData)}>
              Del
            </Text>
          </View>
          <View style={this.props.styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = blkcldCategory;
