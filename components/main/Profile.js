import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View, Text, Image, FlatList, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  gallery: {
    flex: 1,
  },
  image: {
    aspectRatio: 1 / 1,
    flex: 1,
    height: 200,
  },
  info: {
    margin: 20,
  },
});
function Profile(props) {
  const { currentUser, posts } = props;
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <Image
              style={styles.image}
              source={{ uri: item.imgUrl }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);

// TODO: Change types checking with arrayOf and shape
Profile.propTypes = {
  currentUser: PropTypes.shape(React.propTypes).isRequired,
  posts: PropTypes.array.isRequired,
};
