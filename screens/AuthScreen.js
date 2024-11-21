import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { COLORS } from '../theme';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    try {
      // Crée l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Passe à l'étape pour demander le nom
      setIsSignUp(true);
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Enregistre le nom et d'autres détails dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email: user.email,
          createdAt: new Date(),
        });

        // Redirige vers la page Home
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace('Home'))
      .catch((error) => Alert.alert('Login Error', error.message));
  };

  if (isSignUp) {
    // Affiche le champ pour entrer le nom après l'inscription
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Almost There!</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.placeholder}
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveName}>
          <Text style={styles.buttonText}>Save and Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  signUpButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AuthScreen;
