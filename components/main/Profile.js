import React, { useState, useEffect } from 'react';
import {
  Dimensions, Button,
  View, Text, Image, FlatList, StyleSheet, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import transformFirebaseDataToViewModel from '../../services/user.transformer.service';

require('firebase/firestore');

function Profile(props) {
  const { width } = Dimensions.get('window');
  const {
    currentUser, posts, following, route,
  } = props;
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setFollowing] = useState(false);
  const { uid } = route.params;
  const currentUserUid = firebase.auth().currentUser.uid;
  const isMyProfile = uid === currentUserUid;
  const imgSide = width / 3;
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
      height: imgSide,
      width: imgSide,
    },
    imageContainer: {
      flex: 1 / 3,
    },
  });

  useEffect(() => {
    if (isMyProfile) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            Alert.alert('User does not exist');
          }
        });
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          const transformedPosts = transformFirebaseDataToViewModel(snapshot.docs);
          setUserPosts(transformedPosts);
        });
    }
    if (following.indexOf(uid) !== -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [uid, following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(currentUserUid)
      .collection('userFollowing')
      .doc(uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(currentUserUid)
      .collection('userFollowing')
      .doc(uid)
      .delete();
  };

  if (!user) return <View />;

  return (
    <View style={styles.container}>
      <View>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {isMyProfile ? null : (
          <View>
            {isFollowing ? (
              <Button
                title="Following"
                onPress={() => onUnfollow()}
                accessibilityLabel="Unfollow the user"
              />
            ) : (
              <Button
                title="Follow"
                onPress={() => onFollow()}
                accessibilityLabel="Follow the user"
              />
            )}
          </View>
        )}
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.imgUrl }}
              />
            </View>
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
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);

// TODO: Change types checking with arrayOf and shape
Profile.propTypes = {
  currentUser: PropTypes.shape(React.propTypes).isRequired,
  posts: PropTypes.array.isRequired,
  following: PropTypes.array.isRequired,
  route: PropTypes.shape(React.propTypes).isRequired,
};
