import React, {useEffect, useState} from 'react'
import GoalCard from './Components/GoalCard'
import Overview from './Components/Overview'

const App = () => {
  const [goals, setGoals] = useState([])

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    category: "",
    deadline: "",
  });

  const [editingGoalId, setEditingGoalId] = useState(null);

  const [deposit, setDeposit] = useState({
    amount: "",
    goalId: ""
  });



  useEffect(() => {
    fetch("https://json-server-3-q655.onrender.com/goals")
    .then((response) => response.json())
    .then((data) => setGoals(data))
  },[]);



  const handleChange = (e) => {
    setNewGoal({...newGoal, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const goalToSave = {
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: parseFloat(newGoal.savedAmount),
      createdAt: new Date(). toISOString().split("T")[0]
    }
  
    if (editingGoalId) {
    fetch(`https://json-server-3-q655.onrender.com/goals/${editingGoalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(goalToSave)
    })
    .then((response) => response.json())
    .then((updatedGoal) => {
      setGoals(goals.map(goal => goal.id === editingGoalId ? updatedGoal : goal));
      setEditingGoalId(null);
      setNewGoal({
      name: "",
      targetAmount: "",
      savedAmount: "",
      category: "",
      deadline: ""
    })
    })
  } else {
    
  fetch("https://json-server-3-q655.onrender.com/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(goalToSave)
  })
  .then((response) => response.json())
  .then((newData) => {
    setGoals([...goals, newData])
    setNewGoal({
      name: "",
      targetAmount: "",
      savedAmount: "",
      category: "",
      deadline: ""
    })
  })
  }
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      category: goal.category,
      deadline: goal.deadline,
      createdAt: goal.createdAt
    })
  }

  const deleteGoal = (id) => {
    fetch(`https://json-server-3-q655.onrender.com/goals/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setGoals(goals.filter(goal => goal.id !== id));
    })
  }

  const handleDeposit = (e) => {
    e.preventDefault();

    const goalToUpdate = goals.find((goal) => goal.id === (deposit.goalId))
    if (!goalToUpdate) return;

    const updatedSavedAmount = parseFloat(goalToUpdate.savedAmount) + parseFloat(deposit.amount)

    fetch(`http://localhost:3000/goals/${goalToUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({savedAmount: updatedSavedAmount})
      })
      .then((response) => response.json())
      .then((updatedGoal) => {
        const updatedGoals = goals.map((goal)=> (
          goal.id === updatedGoal.id ? updatedGoal : goal
        ));
        setGoals(updatedGoals)
        setDeposit({ amount: "", goalId: ""})
      })
  }


  return (
    
    <div>

      <h1>SMART-GOAL-PLANNER</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Goal Name" value={newGoal.name} onChange={handleChange}/>
        <input name="targetAmount" placeholder="Target Amount" value={newGoal.targetAmount} onChange={handleChange}/>
        <input name="savedAmount" placeholder="Saved Amount" value={newGoal.savedAmount} onChange={handleChange}/>
        <input name="category" placeholder="Category" value={newGoal.category} onChange={handleChange}/>
        <input name="deadline" placeholder="Deadline" value={newGoal.deadline} onChange={handleChange}/>
        <button type="submit">{editingGoalId ? "Update Goal" : "Add Goal"}</button>
      </form>

      <h2>Make a Deposit</h2>
      <form onSubmit={handleDeposit}>
        <input type="number" name="amount" placeholder= "Deposit Amount" value= {deposit.amount} onChange={(e)=> setDeposit({...deposit, amount: e.target.value})} required />
        <select name="goalId" value={deposit.goalId} onChange={(e) => setDeposit({...deposit, goalId: e.target.value})} required>
          <option value="">-- Select Goal --</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>{goal.name}</option>
          ))}
        </select>
        <button type="submit" >Deposit</button>
      </form>

      <Overview  goals={goals}/>
      
      {goals.map((goal) => (
        <div key = {goal.id}>
      <GoalCard 
        name={goal.name}
        targetAmount={goal.targetAmount}
        savedAmount={goal.savedAmount}
        category={goal.category}
        deadline={goal.deadline}
        createdAt = {goal.createdAt}
      />
        <button onClick={() => startEditing(goal)}>Edit</button>
        <button onClick={() => deleteGoal(goal.id)}>Delete</button>
        </div>
    
      ))}

    
    </div>

    
    
  )
}


export default App
