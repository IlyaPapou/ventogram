import firebase from 'firebase';
import 'firebase/firestore';
import { Alert } from 'react-native';
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from '../constants/index';
import transformFirebaseDataToViewModel from '../../services/user.transformer.service';

export const fetchUser = () => (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .get()
  .then((snapshot) => {
    if (snapshot.exists) {
      dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
    } else {
      Alert.alert('User does not exist');
    }
  });

export const fetchUserPosts = () => (dispatch) => firebase
  .firestore()
  .collection('posts')
  .doc(firebase.auth().currentUser.uid)
  .collection('userPosts')
  .orderBy('creation', 'asc')
  .get()
  .then((snapshot) => {
    const posts = transformFirebaseDataToViewModel(snapshot.docs);
    dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
  });

export const fetchUserFollowing = () => (dispatch) => firebase
  .firestore()
  .collection('following')
  .doc(firebase.auth().currentUser.uid)
  .collection('userFollowing')
  .onSnapshot((snapshot) => {
    const following = snapshot.docs.map((doc) => doc.id);
    dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
  });
