"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./TaskManager.module.css";
import Header from "./Header/index";
import Footer from "./Footer/index";
import {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskMenu,
  setActiveTab,
  setSearchQuery,
} from "../store/slices/tasksSlice";
import type { StoreState } from "../store/store";

interface Notification {
  id: number;
  message: string;
  type: "gold" | "health" | "experience";
}

interface Task {
  id: string;
  title: string;
  type: "habit" | "daily" | "todo";
  notes?: string;
  difficulty?: "easy" | "medium" | "hard";
  completed?: boolean;
  isEditing?: boolean;
  showMenu?: boolean;
  startDate?: string;
  repeats?: string;
  repeatEvery?: number;
  repeatOn?: string[];
  tags?: string[];
  dueDate?: string;
  checklist?: string[];
  habitType?: "positive" | "negative";
  userId: string;
}

interface TaskTypeOption {
  type: "habit" | "daily" | "todo";
  label: string;
  icon: string;
}

type Difficulty = "easy" | "medium" | "hard";

export default function TaskManager() {
  const dispatch = useDispatch();
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const tasks = useSelector((state: StoreState) => state.tasks.tasks) || [];
  const activeTab = useSelector((state: StoreState) => state.tasks.activeTab);
  const searchQuery = useSelector(
    (state: StoreState) => state.tasks.searchQuery
  );

  // Move localStorage access to useEffect
  useEffect(() => {
    const userEmail = localStorage.getItem("currentUserEmail");
    setCurrentUserEmail(userEmail);
  }, []);

  // Filter tasks for current user
  const userTasks = tasks.filter(
    (task: Task) => task.userId === currentUserEmail
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showEditHabitModal, setShowEditHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Task | null>(null);
  const [showEditDailyModal, setShowEditDailyModal] = useState(false);
  const [editingDaily, setEditingDaily] = useState<Task | null>(null);
  const [showEditTodoModal, setShowEditTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Task | null>(null);

  const [newHabit, setNewHabit] = useState({
    title: "",
    notes: "",
    difficulty: "easy" as Difficulty,
    habitType: "" as "positive" | "negative" | "",
  });

  const [newDaily, setNewDaily] = useState({
    title: "",
    notes: "",
    difficulty: "easy" as Difficulty,
    startDate: new Date().toISOString().split("T")[0],
    repeats: "weekly",
    repeatEvery: 1,
    repeatOn: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    tags: [] as string[],
  });

  const [newTodo, setNewTodo] = useState({
    title: "",
    notes: "",
    difficulty: "easy" as Difficulty,
    checklist: [] as string[],
    dueDate: "",
    tags: [] as string[],
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const taskTypes: TaskTypeOption[] = [
    { type: "habit", label: "Habit", icon: "⚖️" },
    { type: "daily", label: "Daily", icon: "📅" },
    { type: "todo", label: "To Do", icon: "✓" },
  ];

  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateHabit = () => {
    if (!newHabit.title.trim() || !newHabit.habitType || !currentUserEmail)
      return;

    const habit: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUserEmail,
      title: newHabit.title.trim(),
      notes: newHabit.notes || "",
      difficulty: newHabit.difficulty || "easy",
      type: "habit",
      completed: false,
      habitType: newHabit.habitType,
    };

    dispatch(addTask(habit));
    setNewHabit({ title: "", notes: "", difficulty: "easy", habitType: "" });
    setShowHabitModal(false);
    dispatch(setActiveTab("habits"));
  };

  const handleCreateDaily = () => {
    if (!newDaily.title.trim() || !currentUserEmail) return;

    const daily: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUserEmail,
      title: newDaily.title.trim(),
      notes: newDaily.notes || "",
      difficulty: newDaily.difficulty || "easy",
      type: "daily",
      completed: false,
      startDate: newDaily.startDate || new Date().toISOString().split("T")[0],
      repeats: newDaily.repeats || "weekly",
      repeatEvery: Number(newDaily.repeatEvery) || 1,
      repeatOn: Array.isArray(newDaily.repeatOn)
        ? newDaily.repeatOn
        : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      tags: Array.isArray(newDaily.tags) ? newDaily.tags : [],
    };

    dispatch(addTask(daily));
    setNewDaily({
      title: "",
      notes: "",
      difficulty: "easy",
      startDate: new Date().toISOString().split("T")[0],
      repeats: "weekly",
      repeatEvery: 1,
      repeatOn: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      tags: [],
    });
    setShowDailyModal(false);
    dispatch(setActiveTab("dailies"));
  };

  const handleCreateTodo = () => {
    if (!newTodo.title.trim() || !currentUserEmail) return;

    const todo: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUserEmail,
      title: newTodo.title.trim(),
      notes: newTodo.notes || "",
      difficulty: newTodo.difficulty || "easy",
      type: "todo",
      completed: false,
      dueDate: newTodo.dueDate || "",
      checklist: Array.isArray(newTodo.checklist) ? newTodo.checklist : [],
      tags: Array.isArray(newTodo.tags) ? newTodo.tags : [],
    };

    dispatch(addTask(todo));
    setNewTodo({
      title: "",
      notes: "",
      difficulty: "easy",
      checklist: [],
      dueDate: "",
      tags: [],
    });
    setShowTodoModal(false);
    dispatch(setActiveTab("todos"));
  };

  const updateTaskTitle = (taskId: string, newTitle: string) => {
    const task = userTasks.find((t: Task) => t.id === taskId);
    if (task) {
      dispatch(updateTask({ ...task, title: newTitle || "" }));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleToggleTaskMenu = (taskId: string, show: boolean) => {
    dispatch(toggleTaskMenu({ taskId, show }));
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = userTasks.find((task: Task) => task.id === taskId);
    if (taskToEdit) {
      if (taskToEdit.type === "habit") {
        setEditingHabit(taskToEdit);
        setShowEditHabitModal(true);
      } else if (taskToEdit.type === "daily") {
        setEditingDaily(taskToEdit);
        setShowEditDailyModal(true);
      } else if (taskToEdit.type === "todo") {
        setEditingTodo(taskToEdit);
        setShowEditTodoModal(true);
      }
    }
  };

  const handleSaveHabitEdit = () => {
    if (editingHabit) {
      dispatch(updateTask(editingHabit));
      setShowEditHabitModal(false);
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      dispatch(deleteTask(taskId));
      setShowEditHabitModal(false);
      setEditingHabit(null);
    }
  };

  const handleSaveDailyEdit = () => {
    if (editingDaily) {
      dispatch(updateTask(editingDaily));
      setShowEditDailyModal(false);
      setEditingDaily(null);
    }
  };

  const handleDeleteDaily = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this daily?")) {
      dispatch(deleteTask(taskId));
      setShowEditDailyModal(false);
      setEditingDaily(null);
    }
  };

  const handleSaveTodoEdit = () => {
    if (editingTodo) {
      dispatch(updateTask(editingTodo));
      setShowEditTodoModal(false);
      setEditingTodo(null);
    }
  };

  const handleDeleteTodo = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      dispatch(deleteTask(taskId));
      setShowEditTodoModal(false);
      setEditingTodo(null);
    }
  };

  const filteredTasks = Array.isArray(userTasks)
    ? userTasks.filter((task) => {
        const matchesType =
          activeTab === "habits"
            ? task.type === "habit"
            : activeTab === "dailies"
            ? task.type === "daily"
            : task.type === "todo";

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          searchQuery === "" ||
          task.title.toLowerCase().includes(searchLower) ||
          (task.notes && task.notes.toLowerCase().includes(searchLower));
        return matchesType && matchesSearch;
      })
    : [];

  const showNotification = (
    message: string,
    type: "gold" | "health" | "experience"
  ) => {
    const id = Date.now() + Math.random(); // Ensure unique IDs for simultaneous notifications
    const newNotification = { id, message, type };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  // Add this before the return statement
  const dailiesCount = userTasks.filter(
    (task: Task) => task.type === "daily"
  ).length;

  if (!isInitialized) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.notificationContainer}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notification} ${
                notification.type === "health"
                  ? styles.healthNotification
                  : notification.type === "experience"
                  ? styles.experienceNotification
                  : ""
              }`}
              data-type={notification.type}
            >
              {notification.type === "gold" && (
                <span className={styles.goldIcon}>💰</span>
              )}
              {notification.type === "health" && (
                <span className={styles.healthIcon}>❤️</span>
              )}
              {notification.type === "experience" && (
                <span className={styles.experienceIcon}>⭐</span>
              )}
              {notification.message}
            </div>
          ))}
        </div>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search tasks..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => dispatch(setSearchQuery(""))}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.addTaskContainer}>
              <button
                className={styles.addTaskButton}
                onClick={() => setIsPopupOpen(!isPopupOpen)}
              >
                + Add Task
              </button>
              {isPopupOpen && (
                <div className={styles.popup} ref={popupRef}>
                  {taskTypes.map((taskType) => (
                    <button
                      key={taskType.type}
                      className={styles.popupOption}
                      onClick={() => {
                        if (taskType.type === "habit") {
                          setShowHabitModal(true);
                        } else if (taskType.type === "daily") {
                          setShowDailyModal(true);
                        } else if (taskType.type === "todo") {
                          setShowTodoModal(true);
                        }
                        setIsPopupOpen(false);
                      }}
                    >
                      <span className={styles.optionIcon}>{taskType.icon}</span>
                      <span>{taskType.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showHabitModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal} ref={modalRef}>
                <div className={styles.modalHeader}>
                  <h2>Create Habit</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setShowHabitModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.createButton}
                      onClick={handleCreateHabit}
                      disabled={!newHabit.title.trim() || !newHabit.habitType}
                    >
                      Create
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={newHabit.title}
                      onChange={(e) =>
                        setNewHabit({ ...newHabit, title: e.target.value })
                      }
                      placeholder="Add a title"
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={newHabit.notes}
                      onChange={(e) =>
                        setNewHabit({ ...newHabit, notes: e.target.value })
                      }
                      placeholder="Add notes"
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.habitTypeSelection}>
                    <div className={styles.habitTypeButton}>
                      <button
                        className={`${styles.circleButton} ${
                          styles.positiveButton
                        } ${
                          newHabit.habitType === "positive"
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          setNewHabit({ ...newHabit, habitType: "positive" })
                        }
                        type="button"
                      >
                        +
                      </button>
                      <span className={styles.buttonLabel}>Positive</span>
                    </div>
                    <div className={styles.habitTypeButton}>
                      <button
                        className={`${styles.circleButton} ${
                          styles.negativeButton
                        } ${
                          newHabit.habitType === "negative"
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          setNewHabit({ ...newHabit, habitType: "negative" })
                        }
                        type="button"
                      >
                        −
                      </button>
                      <span className={styles.buttonLabel}>Negative</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select
                      value={newHabit.difficulty}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          difficulty: e.target.value as
                            | "easy"
                            | "medium"
                            | "hard",
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <button
                    className={styles.createButton}
                    onClick={handleCreateHabit}
                    disabled={!newHabit.title.trim() || !newHabit.habitType}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDailyModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal} ref={modalRef}>
                <div className={styles.modalHeader}>
                  <h2>Create Daily</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setShowDailyModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.createButton}
                      onClick={handleCreateDaily}
                      disabled={!newDaily.title.trim()}
                    >
                      Create
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={newDaily.title}
                      onChange={(e) =>
                        setNewDaily({ ...newDaily, title: e.target.value })
                      }
                      placeholder="Add a title"
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={newDaily.notes}
                      onChange={(e) =>
                        setNewDaily({ ...newDaily, notes: e.target.value })
                      }
                      placeholder="Add notes"
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newDaily.startDate}
                      onChange={(e) =>
                        setNewDaily({ ...newDaily, startDate: e.target.value })
                      }
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeats</label>
                    <select
                      value={newDaily.repeats}
                      onChange={(e) =>
                        setNewDaily({ ...newDaily, repeats: e.target.value })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeat Every</label>
                    <div className={styles.repeatEveryContainer}>
                      <input
                        type="number"
                        min="1"
                        value={newDaily.repeatEvery}
                        onChange={(e) =>
                          setNewDaily({
                            ...newDaily,
                            repeatEvery: parseInt(e.target.value),
                          })
                        }
                        className={styles.modalInput}
                      />
                      <span>Week</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeat On</label>
                    <div className={styles.weekDays}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <button
                          key={day}
                          className={`${styles.dayButton} ${
                            newDaily.repeatOn.includes(day)
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => {
                            const newRepeatOn = newDaily.repeatOn.includes(day)
                              ? newDaily.repeatOn.filter((d) => d !== day)
                              : [...newDaily.repeatOn, day];
                            setNewDaily({ ...newDaily, repeatOn: newRepeatOn });
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select
                      value={newDaily.difficulty}
                      onChange={(e) =>
                        setNewDaily({
                          ...newDaily,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags</label>
                    <input
                      type="text"
                      placeholder="Add tags..."
                      className={styles.modalInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          setNewDaily({
                            ...newDaily,
                            tags: [
                              ...newDaily.tags,
                              e.currentTarget.value.trim(),
                            ],
                          });
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>

                  <button
                      className={styles.createButton}
                      onClick={handleCreateDaily}
                      disabled={!newDaily.title.trim()}
                    >
                      Create
                    </button>
                </div>
              </div>
            </div>
          )}

          {showTodoModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal} ref={modalRef}>
                <div className={styles.modalHeader}>
                  <h2>Create To Do</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setShowTodoModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.createButton}
                      onClick={handleCreateTodo}
                      disabled={!newTodo.title.trim()}
                    >
                      Create
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, title: e.target.value })
                      }
                      placeholder="Add a title"
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={newTodo.notes}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, notes: e.target.value })
                      }
                      placeholder="Add notes"
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Checklist</label>
                    <div className={styles.checklistContainer}>
                      <button
                        className={styles.addChecklistItem}
                        onClick={() => {
                          const item = prompt("Enter checklist item:");
                          if (item?.trim()) {
                            setNewTodo({
                              ...newTodo,
                              checklist: [...newTodo.checklist, item.trim()],
                            });
                          }
                        }}
                      >
                        + New checklist item
                      </button>
                      {newTodo.checklist.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                          <span>{item}</span>
                          <button
                            onClick={() => {
                              setNewTodo({
                                ...newTodo,
                                checklist: newTodo.checklist.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                            className={styles.removeChecklistItem}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select
                      value={newTodo.difficulty}
                      onChange={(e) =>
                        setNewTodo({
                          ...newTodo,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, dueDate: e.target.value })
                      }
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags</label>
                    <input
                      type="text"
                      placeholder="Add tags..."
                      className={styles.modalInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          setNewTodo({
                            ...newTodo,
                            tags: [
                              ...newTodo.tags,
                              e.currentTarget.value.trim(),
                            ],
                          });
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    {newTodo.tags.length > 0 && (
                      <div className={styles.tagList}>
                        {newTodo.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                            <button
                              onClick={() => {
                                setNewTodo({
                                  ...newTodo,
                                  tags: newTodo.tags.filter(
                                    (_, i) => i !== index
                                  ),
                                });
                              }}
                              className={styles.removeTag}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                      className={styles.createButton}
                      onClick={handleCreateTodo}
                      disabled={!newTodo.title.trim()}
                    >
                      Create
                    </button>
                </div>
              </div>
            </div>
          )}

          {showEditHabitModal && editingHabit && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.modal} ${styles.editHabitModal}`}>
                <div className={styles.modalHeader}>
                  <h2>Edit Habit</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setShowEditHabitModal(false);
                        setEditingHabit(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveHabitEdit}
                      disabled={!editingHabit.title.trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={editingHabit.title}
                      onChange={(e) =>
                        setEditingHabit({
                          ...editingHabit,
                          title: e.target.value,
                        })
                      }
                      placeholder="Click here to edit this into a bad habit you'd like to quit"
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <div className={styles.notesContainer}>
                      <textarea
                        value={editingHabit.notes}
                        onChange={(e) =>
                          setEditingHabit({
                            ...editingHabit,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Or delete from the edit screen"
                        className={styles.modalTextarea}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className={styles.habitTypeSelection}>
                    <div className={styles.habitTypeButton}>
                      <button
                        className={`${styles.circleButton} ${
                          styles.positiveButton
                        } ${
                          editingHabit.habitType === "positive"
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          setEditingHabit({
                            ...editingHabit,
                            habitType: "positive",
                          })
                        }
                      >
                        +
                      </button>
                      <span className={styles.buttonLabel}>Positive</span>
                    </div>
                    <div className={styles.habitTypeButton}>
                      <button
                        className={`${styles.circleButton} ${
                          styles.negativeButton
                        } ${
                          editingHabit.habitType === "negative"
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          setEditingHabit({
                            ...editingHabit,
                            habitType: "negative",
                          })
                        }
                      >
                        −
                      </button>
                      <span className={styles.buttonLabel}>Negative</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Difficulty
                      <span className={styles.infoIcon}>ⓘ</span>
                    </label>
                    <select
                      value={editingHabit.difficulty}
                      onChange={(e) =>
                        setEditingHabit({
                          ...editingHabit,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy ★★</option>
                      <option value="medium">Medium ★★★</option>
                      <option value="hard">Hard ★★★★</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags</label>
                    <input
                      type="text"
                      placeholder="Add tags..."
                      className={styles.modalInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          setEditingHabit({
                            ...editingHabit,
                            tags: [
                              ...(editingHabit.tags || []),
                              e.currentTarget.value.trim(),
                            ],
                          });
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Reset Counter</label>
                    <select className={styles.modalSelect} defaultValue="daily">
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div className={styles.deleteHabitContainer}>
                    <button
                      className={styles.deleteHabitButton}
                      onClick={() => handleDeleteHabit(editingHabit.id)}
                    >
                      <span className={styles.deleteIcon}>🗑</span>
                      Delete this Habit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditDailyModal && editingDaily && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.modal} ${styles.editDailyModal}`}>
                <div className={styles.modalHeader}>
                  <h2>Edit Daily</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setShowEditDailyModal(false);
                        setEditingDaily(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveDailyEdit}
                      disabled={!editingDaily.title.trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={editingDaily.title}
                      onChange={(e) =>
                        setEditingDaily({
                          ...editingDaily,
                          title: e.target.value,
                        })
                      }
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={editingDaily.notes}
                      onChange={(e) =>
                        setEditingDaily({
                          ...editingDaily,
                          notes: e.target.value,
                        })
                      }
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Checklist</label>
                    <div className={styles.checklistContainer}>
                      {editingDaily.checklist?.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                          <label className={styles.checklistLabel}>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => {}}
                              className={styles.checklistCheckbox}
                            />
                            <span>{item}</span>
                          </label>
                        </div>
                      ))}
                      <button
                        className={styles.addChecklistItem}
                        onClick={() => {
                          const item = prompt("Enter checklist item:");
                          if (item?.trim()) {
                            setEditingDaily({
                              ...editingDaily,
                              checklist: [
                                ...(editingDaily.checklist || []),
                                item.trim(),
                              ],
                            });
                          }
                        }}
                      >
                        + New checklist item
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Difficulty
                      <span className={styles.infoIcon}>ⓘ</span>
                    </label>
                    <select
                      value={editingDaily.difficulty}
                      onChange={(e) =>
                        setEditingDaily({
                          ...editingDaily,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy ★★</option>
                      <option value="medium">Medium ★★★</option>
                      <option value="hard">Hard ★★★★</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={editingDaily.startDate || ""}
                      onChange={(e) =>
                        setEditingDaily({
                          ...editingDaily,
                          startDate: e.target.value,
                        })
                      }
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeats</label>
                    <select
                      value={editingDaily.repeats || "monthly"}
                      onChange={(e) =>
                        setEditingDaily({
                          ...editingDaily,
                          repeats: e.target.value,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeat Every</label>
                    <div className={styles.repeatEveryContainer}>
                      <input
                        type="number"
                        min="1"
                        value={editingDaily.repeatEvery || 1}
                        onChange={(e) =>
                          setEditingDaily({
                            ...editingDaily,
                            repeatEvery: parseInt(e.target.value),
                          })
                        }
                        className={styles.modalInput}
                      />
                      <span>Months</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeat On</label>
                    <div className={styles.repeatOnOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="repeatOn"
                          value="dayOfMonth"
                          checked={editingDaily.repeatOn?.[0] === "dayOfMonth"}
                          onChange={() =>
                            setEditingDaily({
                              ...editingDaily,
                              repeatOn: ["dayOfMonth"],
                            })
                          }
                        />
                        Day of the Month
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="repeatOn"
                          value="dayOfWeek"
                          checked={editingDaily.repeatOn?.[0] === "dayOfWeek"}
                          onChange={() =>
                            setEditingDaily({
                              ...editingDaily,
                              repeatOn: ["dayOfWeek"],
                            })
                          }
                        />
                        Day of the Week
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags</label>
                    <div className={styles.tagsContainer}>
                      {editingDaily.tags?.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                          <button
                            onClick={() => {
                              setEditingDaily({
                                ...editingDaily,
                                tags: editingDaily.tags?.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                            className={styles.removeTag}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tags..."
                        className={styles.modalInput}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value.trim()
                          ) {
                            setEditingDaily({
                              ...editingDaily,
                              tags: [
                                ...(editingDaily.tags || []),
                                e.currentTarget.value.trim(),
                              ],
                            });
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.deleteContainer}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteDaily(editingDaily.id)}
                    >
                      <span className={styles.deleteIcon}>🗑</span>
                      Delete this Daily
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditTodoModal && editingTodo && (
            <div className={styles.modalOverlay}>
              <div className={`${styles.modal} ${styles.editTodoModal}`}>
                <div className={styles.modalHeader}>
                  <h2>Edit To Do</h2>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setShowEditTodoModal(false);
                        setEditingTodo(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveTodoEdit}
                      disabled={!editingTodo.title.trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Title*</label>
                    <input
                      type="text"
                      value={editingTodo.title}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter task title"
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notes</label>
                    <textarea
                      value={editingTodo.notes}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Enter task notes"
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Checklist</label>
                    <div className={styles.checklistContainer}>
                      {editingTodo.checklist?.map((item, index) => (
                        <div key={index} className={styles.checklistItem}>
                          <label className={styles.checklistLabel}>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => {}}
                              className={styles.checklistCheckbox}
                            />
                            <span>{item}</span>
                          </label>
                        </div>
                      ))}
                      <button
                        className={styles.addChecklistItem}
                        onClick={() => {
                          const item = prompt("Enter checklist item:");
                          if (item?.trim()) {
                            setEditingTodo({
                              ...editingTodo,
                              checklist: [
                                ...(editingTodo.checklist || []),
                                item.trim(),
                              ],
                            });
                          }
                        }}
                      >
                        + New checklist item
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select
                      value={editingTodo.difficulty}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                      className={styles.modalSelect}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={editingTodo.dueDate}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          dueDate: e.target.value,
                        })
                      }
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags</label>
                    <div className={styles.tagsContainer}>
                      {editingTodo.tags?.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                          <button
                            onClick={() => {
                              setEditingTodo({
                                ...editingTodo,
                                tags: editingTodo.tags?.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                            className={styles.removeTag}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tags..."
                        className={styles.modalInput}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value.trim()
                          ) {
                            setEditingTodo({
                              ...editingTodo,
                              tags: [
                                ...(editingTodo.tags || []),
                                e.currentTarget.value.trim(),
                              ],
                            });
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.deleteContainer}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteTodo(editingTodo.id)}
                    >
                      <span className={styles.deleteIcon}>🗑</span>
                      Delete this To Do
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "habits" ? styles.active : ""
              }`}
              onClick={() => dispatch(setActiveTab("habits"))}
            >
              Habits
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "dailies" ? styles.active : ""
              }`}
              onClick={() => dispatch(setActiveTab("dailies"))}
            >
              Dailies
              <span className={styles.tabCount}>{dailiesCount}</span>
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "todos" ? styles.active : ""
              }`}
              onClick={() => dispatch(setActiveTab("todos"))}
            >
              To Dos
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <div className={styles.taskList}>
                {filteredTasks.map((task) => (
                  <div key={task.id} className={styles.taskCard}>
                    {task.type === "habit" && (
                      <div className={styles.habitContainer}>
                        <div className={styles.habitButtons}>
                          <button
                            className={`${styles.actionButton} ${
                              styles.positiveButton
                            } ${
                              (
                                task as Task & {
                                  habitType: "positive" | "negative";
                                }
                              ).habitType === "positive"
                                ? styles.active
                                : styles.inactive
                            }`}
                            onClick={() => {
                              const habitTask = task as Task & {
                                habitType: "positive" | "negative";
                              };
                              if (habitTask.habitType === "positive") {
                                dispatch(
                                  updateTask({
                                    ...task,
                                    completed: true,
                                  })
                                );
                                showNotification(
                                  "You gained 5 gold! ✨",
                                  "gold"
                                );
                              }
                            }}
                          >
                            +
                          </button>

                          <div className={styles.taskCardContent}>
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) =>
                                updateTaskTitle(task.id, e.target.value)
                              }
                              placeholder="Enter habit title"
                              className={styles.taskTitle}
                            />
                            {task.notes && (
                              <div className={styles.taskNotes}>
                                {task.notes}
                              </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className={styles.taskTags}>
                                <span className={styles.tagIcon}>🏷️</span>
                                <div className={styles.tagsList}>
                                  {task.tags.map(
                                    (tag: string, index: number) => (
                                      <span key={index} className={styles.tag}>
                                        {tag}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            className={`${styles.actionButton} ${
                              styles.negativeButton
                            } ${
                              (
                                task as Task & {
                                  habitType: "positive" | "negative";
                                }
                              ).habitType === "negative"
                                ? styles.active
                                : styles.inactive
                            }`}
                            onClick={() => {
                              const habitTask = task as Task & {
                                habitType: "positive" | "negative";
                              };
                              if (habitTask.habitType === "negative") {
                                dispatch(
                                  updateTask({
                                    ...task,
                                    completed: true,
                                  })
                                );
                                showNotification(
                                  "You lost 5 health! ❤️",
                                  "health"
                                );
                              }
                            }}
                          >
                            −
                          </button>
                        </div>

                        <div className={styles.menuContainer}>
                          <button
                            className={styles.menuButton}
                            onClick={() =>
                              handleToggleTaskMenu(task.id, !task.showMenu)
                            }
                          >
                            ⋮
                          </button>
                          {task.showMenu && (
                            <div className={styles.menuDropdown}>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleEditTask(task.id)}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {task.type === "daily" && (
                      <>
                        <div className={styles.taskCheckbox}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {
                              dispatch(
                                updateTask({
                                  ...task,
                                  completed: !task.completed,
                                })
                              );
                              if (!task.completed) {
                                // When checking the box
                                showNotification(
                                  "You gained 10 gold! ✨",
                                  "gold"
                                );
                                setTimeout(() => {
                                  showNotification(
                                    "You gained 20 experience! 📈",
                                    "experience"
                                  );
                                }, 300);
                              } else {
                                // When unchecking the box
                                showNotification("You spent 10 gold", "gold");
                                setTimeout(() => {
                                  showNotification(
                                    "You lost 20 experience",
                                    "experience"
                                  );
                                }, 300);
                              }
                            }}
                          />
                        </div>

                        <div className={styles.taskCardContent}>
                          <div className={styles.taskTitleContainer}>
                            <span className={styles.taskTitle}>
                              {task.title}
                            </span>
                            {task.notes && (
                              <div className={styles.taskNotes}>
                                {task.notes}
                              </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className={styles.taskTags}>
                                <span className={styles.tagIcon}>🏷️</span>
                                <div className={styles.tagsList}>
                                  {task.tags.map(
                                    (tag: string, index: number) => (
                                      <span key={index} className={styles.tag}>
                                        {tag}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.menuContainer}>
                          <button
                            className={styles.menuButton}
                            onClick={() =>
                              handleToggleTaskMenu(task.id, !task.showMenu)
                            }
                          >
                            ⋮
                          </button>
                          {task.showMenu && (
                            <div className={styles.menuDropdown}>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleEditTask(task.id)}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {task.type === "todo" && (
                      <>
                        <div className={styles.taskCheckbox}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {
                              if (!task.completed) {
                                // When checking the box
                                showNotification(
                                  "You gained 15 gold! ✨",
                                  "gold"
                                );
                                setTimeout(() => {
                                  showNotification(
                                    "You gained 25 experience! 📈",
                                    "experience"
                                  );
                                }, 300);

                                // Remove the todo after a short delay to allow animations to complete
                                setTimeout(() => {
                                  dispatch(deleteTask(task.id));
                                }, 1000);
                              }
                            }}
                          />
                        </div>

                        <div className={styles.taskCardContent}>
                          <div className={styles.taskTitleContainer}>
                            <span className={styles.taskTitle}>
                              {task.title}
                            </span>
                            {task.dueDate && (
                              <span className={styles.dueDate}>
                                Due:{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {task.notes && (
                              <div className={styles.taskNotes}>
                                {task.notes}
                              </div>
                            )}
                            {task.checklist && task.checklist.length > 0 && (
                              <div className={styles.checklist}>
                                {task.checklist.map(
                                  (item: string, index: number) => (
                                    <div
                                      key={index}
                                      className={styles.checklistItem}
                                    >
                                      <input
                                        type="checkbox"
                                        className={styles.checklistCheckbox}
                                      />
                                      <span>{item}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className={styles.taskTags}>
                                <span className={styles.tagIcon}>🏷️</span>
                                <div className={styles.tagsList}>
                                  {task.tags.map(
                                    (tag: string, index: number) => (
                                      <span key={index} className={styles.tag}>
                                        {tag}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.menuContainer}>
                          <button
                            className={styles.menuButton}
                            onClick={() =>
                              handleToggleTaskMenu(task.id, !task.showMenu)
                            }
                          >
                            ⋮
                          </button>
                          {task.showMenu && (
                            <div className={styles.menuDropdown}>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleEditTask(task.id)}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.menuItem}
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      {activeTab === "habits" && "⚖️"}
                      {activeTab === "dailies" && "📅"}
                      {activeTab === "todos" && "✓"}
                    </div>
                    <div className={styles.emptyText}>
                      {`These are your ${activeTab}`}
                      <br />
                      {activeTab === "habits" &&
                        "Habits don't have a rigid schedule. You can check them off multiple times per day."}
                      {activeTab === "dailies" &&
                        "Dailies repeat on a regular basis. Choose the schedule that works best for you!"}
                      {activeTab === "todos" &&
                        "To Dos need to be completed once. Add checklists to your To Dos to increase their value."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
