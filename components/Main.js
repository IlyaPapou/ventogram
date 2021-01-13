import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { fetchUser } from '../redux/actions/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export class Main extends Component {
  componentDidMount() {
    const { fetchUserAction } = this.props;
    fetchUserAction();
  }

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.container}>
        <Text>
          {currentUser.name.length ? currentUser.name : 'User'}
          {' '}
          is Signed In
        </Text>
      </View>
    );
  }
}

Main.propTypes = {
  fetchUserAction: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
};

Main.defaultProps = {
  currentUser: {
    email: '',
    name: '',
  },
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserAction: fetchUser,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
