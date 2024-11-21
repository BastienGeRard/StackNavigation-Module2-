import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { COLORS } from '../theme';

const ContactScreen = () => {
  const [problem, setProblem] = useState('');

  const handleSubmit = () => {
    if (problem.trim()) {
      Alert.alert('Thank you!', 'Your issue has been reported. We will get back to you soon.');
      setProblem('');
    } else {
      Alert.alert('Error', 'Please describe the problem before submitting.');
    }
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/fakeprofile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📧 Email: support@fakemail.com</Text>
        <TouchableOpacity style={styles.instagramButton} onPress={handleInstagramPress}>
          <Text style={styles.instagramButtonText}>Follow us on Instagram</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>Report a Problem</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your issue here..."
        placeholderTextColor={COLORS.placeholder}
        multiline
        value={problem}
        onChangeText={setProblem}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  instagramButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  instagramButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  subTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    color: COLORS.text,
    marginBottom: 20,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ContactScreen;
