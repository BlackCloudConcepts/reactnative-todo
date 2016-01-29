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

var user = {};

class blkcldLogin extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      username: '',
      password: ''
    }
  }

  login() {
    user.username = this.state.username;
    user.password = this.state.password;
    this.props.navigator.push({
      title: "Groceries",
      component: this.props.components.blkcldList,
      passProps: {
        components: this.props.components,
        styles: this.props.styles,
        user: user
      }
    });
  }

  render() {
    return (
      <View style={this.props.styles.appContainer}>
        <View style={this.props.styles.inputcontainer}>
          <TextInput autoCapitalize={'none'} style={this.props.styles.input} onChangeText={(text) => this.setState({username: text})} value={this.state.username}/>
          <TextInput autoCapitalize={'none'} style={this.props.styles.input} onChangeText={(text) => this.setState({password: text})} value={this.state.password}/>
          <TouchableHighlight
            style={this.props.styles.button}
            onPress={() => this.login()}
            underlayColor='#dddddd'>
            <Text style={this.props.styles.btnText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
module.exports = blkcldLogin;
