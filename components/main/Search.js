import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import transformFirebaseDataToViewModel from '../../services/user.transformer.service';

require('firebase/firestore');

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection('users')
      .where('name', '>=', search)
      .get()
      .then((snapshot) => {
        const transformedUsers = transformFirebaseDataToViewModel(snapshot.docs);
        setUsers(transformedUsers);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Enter user name"
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={(item) => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Profile', { uid: item.item.id })}
          >
            <Text>{item.item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
