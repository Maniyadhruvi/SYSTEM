"use client";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
// import TaskManager from './components/TaskManager';

export default function Page() {
  return (
    <main>
      <Home />
      {/* <footer></footer> */}
      {/* <TaskManager /> */}
      <Register />
    </main>
  );
}
