import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { COLORS } from '../theme';

const SettingsScreen = ({ navigation }) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const user = auth.currentUser;

  const handleUpdateName = async () => {
    if (newName.trim()) {
      try {
        // Met à jour le profil Firebase
        await updateProfile(user, { displayName: newName });
        // Met à jour le nom dans Firestore (si vous stockez des données utilisateur dans Firebase)
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { name: newName });
        Alert.alert('Success', 'Name updated successfully!');
        setNewName('');
        navigation.navigate('Home'); // Retourne à la page Home
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Name cannot be empty.');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length >= 6) {
      try {
        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Password updated successfully!');
        setNewPassword('');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user);
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              navigation.replace('Auth'); // Retourne à la page d'authentification
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Changer le nom */}
      <TextInput
        style={styles.input}
        placeholder="New Name"
        placeholderTextColor={COLORS.placeholder}
        value={newName}
        onChangeText={setNewName}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
        <Text style={styles.buttonText}>Update Name</Text>
      </TouchableOpacity>
      {/* Changer le mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
      {/* Supprimer le compte */}
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    color: COLORS.text,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  button: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    borderColor: '#B71C1C',
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SettingsScreen;
