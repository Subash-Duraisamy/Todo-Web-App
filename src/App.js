import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBwucfhssqq-MDxGq125Jbu9exDtDfjw4w",
  authDomain: "todo-frontend-291d3.firebaseapp.com",
  projectId: "todo-frontend-291d3",
  storageBucket: "todo-frontend-291d3.appspot.com",
  messagingSenderId: "870318971254",
  appId: "1:870318971254:web:4f9590066587570a968257",
  measurementId: "G-F979RYVQFB"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Add task
  const addTask = async () => {
    if (task === '') {
      setMessage("Oops! A task without a name? That’s a no-go!");
      return;
    }

    try {
      const tasksCollectionRef = collection(db, "Col_ID");
      const timestamp = new Date().toISOString();
      const taskDocRef = doc(tasksCollectionRef, timestamp);

      await setDoc(taskDocRef, {
        tasks: task,
        completed: false
      });

      setMessage("Task added!");
      setTask('');
      fetchTasks(timestamp); // pass new task id to mark it
    } catch (e) {
      console.error("Error adding task: ", e);
      setMessage("Error adding task.");
    }
  };

  // Fetch tasks
  const fetchTasks = async (newTaskId = null) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Col_ID"));
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({
          id: doc.id,
          ...doc.data(),
          isNew: doc.id === newTaskId
        });
      });

      setTasks(tasksList);
      if (newTaskId) {
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === newTaskId ? { ...task, isNew: false } : task
            )
          );
        }, 800);
      }
    } catch (e) {
      console.error("Error fetching tasks: ", e);
      setMessage("Error fetching tasks.");
    }
  };

  // Delete task with animation
  const deleteTask = async (taskId) => {
    setDeletingTaskId(taskId);
    setTimeout(async () => {
      try {
        await deleteDoc(doc(db, "Col_ID", taskId));
        setMessage("Task deleted.");
        fetchTasks();
        setDeletingTaskId(null);
      } catch (e) {
        console.error("Error deleting task: ", e);
        setMessage("Error deleting task.");
        setDeletingTaskId(null);
      }
    }, 500); // delay to allow animation
  };

  // Toggle complete
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await setDoc(
        doc(db, "Col_ID", taskId),
        { completed: !currentStatus },
        { merge: true }
      );
      fetchTasks();
    } catch (e) {
      console.error("Error toggling task: ", e);
    }
  };

  // Edit task
  const editTask = async (taskId, newTask) => {
    try {
      await setDoc(
        doc(db, "Col_ID", taskId),
        { tasks: newTask },
        { merge: true }
      );
      setMessage("Task updated.");
      fetchTasks();
    } catch (e) {
      console.error("Error editing task: ", e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
   <div className="heading-container">
  <div className="hanging-nail"></div>
  <h1 className="hanging-heading">
  
  {/* Todo List
   */}
  

   <span >T</span>
  <span >o</span>
  <span className="blue-letter">d</span>
  <span className="blue-letter">o</span>
  <span> </span>
  <span>L</span>
  <span className="blue-letter">i</span>
  <span className="blue-letter">s</span>
  <span className="blue-letter">t</span>

  </h1>
</div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((taskItem) => (
            <div
              key={taskItem.id}
              className={`task-wrapper ${taskItem.isNew ? 'newly-added' : ''} ${
                deletingTaskId === taskItem.id ? 'deleting' : ''
              }`}
            >
              <div
                className={`task-box ${
                  taskItem.completed ? 'completed' : ''
                }`}
              >
                <input
                  type="text"
                  value={taskItem.tasks}
                  onChange={(e) => {
                    const updatedTask = e.target.value;
                    setTasks((prev) =>
                      prev.map((task) =>
                        task.id === taskItem.id
                          ? { ...task, tasks: updatedTask }
                          : task
                      )
                    );
                  }}
                />
              </div>

              <div className="task-actions-outside">
                <button
                  onClick={() => editTask(taskItem.id, taskItem.tasks)}
                  className="icon-btn"
                >
                  <i className="fas fa-save"></i>
                </button>
                <button
                  onClick={() =>
                    toggleTaskCompletion(taskItem.id, taskItem.completed)
                  }
                  className="icon-btn"
                >
                  <i
                    className={`fas ${
                      taskItem.completed
                        ? 'fa-check-circle black-completed'
                        : 'fa-circle blue-pending'
                    }`}
                  ></i>
                </button>
                <button
                  onClick={() => deleteTask(taskItem.id)}
                  className="icon-btn"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
