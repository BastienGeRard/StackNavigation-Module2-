import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const user = auth.currentUser; // Utilisateur actuel

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksArray = [];
        querySnapshot.forEach((doc) => {
          tasksArray.push({ ...doc.data(), id: doc.id });
        });
        setTasks(tasksArray);
      });

      return unsubscribe;
    }
  }, [user]);

  const addTask = async () => {
    if (task.trim() === '') {
      Alert.alert('Error', 'Task description cannot be empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        text: task,
        dueDate: dueDate.toISOString(),
        completed: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setTask('');
      setDueDate(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to add task: ' + error.message);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      await updateDoc(taskDoc, { completed: true });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task: ' + error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      await deleteDoc(taskDoc);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task: ' + error.message);
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <View>
        <Text style={item.completed ? styles.completedTask : styles.taskText}>
          {item.text}
        </Text>
        <Text style={styles.dueDateText}>Due: {new Date(item.dueDate).toDateString()}</Text>
      </View>
      <View style={styles.taskActions}>
        {!item.completed && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsCompleted(item.id)}
          >
            <Text style={styles.actionText}>Complete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
        placeholderTextColor="#B0BEC5"
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          {`Due Date: ${dueDate.toDateString()}`}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}
      <Button title="Add Task" onPress={addTask} color="#1F8EF1" />
      <Text style={styles.sectionTitle}>To-Do Tasks</Text>
      <FlatList
        data={tasks.filter((task) => !task.completed)}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />
      <Text style={styles.sectionTitle}>Completed Tasks</Text>
      <FlatList
        data={tasks.filter((task) => task.completed)}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  input: {
    borderColor: '#1F8EF1',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#1E2A38',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#37474F',
  },
  taskText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  completedTask: {
    color: '#90A4AE',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  dueDateText: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  taskActions: {
    flexDirection: 'row',
  },
  completeButton: {
    backgroundColor: '#1F8EF1',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default TaskScreen;
