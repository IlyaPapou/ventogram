import firebase from 'firebase';
import 'firebase/firestore';
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from '../constants/index';
import transformUserPostsToViewModel from '../../services/user.transformer.service';

export const fetchUser = () => (dispatch) => firebase.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .get()
  .then((snapshot) => {
    if (snapshot.exists) {
      dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
    } else {
      console.log('User does not exist');
    }
  });

export const fetchUserPosts = () => (dispatch) => firebase.firestore()
  .collection('posts')
  .doc(firebase.auth().currentUser.uid)
  .collection('userPosts')
  .orderBy('creation', 'asc')
  .get()
  .then((snapshot) => {
    const posts = transformUserPostsToViewModel(snapshot.docs);
    dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
  });
