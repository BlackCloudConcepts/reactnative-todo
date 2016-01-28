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

var Firebase = require('firebase');

// Define Components
var components = {};
import blkcldLogin from './src/login.js';
components.blkcldLogin = blkcldLogin;
import blkcldList from './src/list.js';
components.blkcldList = blkcldList

var styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#993344',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#993344',
    justifyContent: 'center',
    // color: '#FFFFFF',
    borderRadius: 4
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#993344',
    borderRadius: 4,
    color: '#993344'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  todoText: {
    flex: 1
  },
  container: {
    flex: 1
  }
});

class blkcld_todo extends React.Component {
 render() {
   return (
     <React.NavigatorIOS
       style={styles.container}
       translucent={false}
       titleTextColor={'#CCCCCC'}
       tintColor={'#000000'}
       barTintColor={'#993344'}
       initialRoute={{
         title: 'Login',
         component: blkcldLogin,
         passProps: {
           components: components,
           styles: styles
         }
       }}/>
   );
 }
}

AppRegistry.registerComponent('blkcld_todo', () => blkcld_todo);
