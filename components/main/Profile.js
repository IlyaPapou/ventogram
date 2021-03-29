import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View, Text, Image, FlatList, StyleSheet,
} from 'react-native';
import firebase from 'firebase';
import transformFirebaseDataToViewModel from '../../services/user.transformer.service';

require('firebase/firestore');

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
});
function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const { route } = props;

  useEffect(() => {
    const { currentUser, posts } = props;
    if (route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log('User does not exist');
          }
        });
      firebase
        .firestore()
        .collection('posts')
        .doc(route.params.uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          const transformedPosts = transformFirebaseDataToViewModel(snapshot.docs);
          setUserPosts(transformedPosts);
        });
    }
  }, [route.params.uid]);

  if (user === null) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
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
  route: PropTypes.shape(React.propTypes).isRequired,
};
