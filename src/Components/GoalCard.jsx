import React from 'react'

const GoalCard = ({ name, targetAmount, savedAmount, category, deadline, createdAt}) => {
    const remaining = targetAmount - savedAmount;
    const progress = Math.round(Math.min((savedAmount / targetAmount) * 100, 100));

    return (
    <div>
        <h2>{name}</h2>
        <p> Target Amount: {targetAmount}</p>
        <p> Saved Amount: {savedAmount}</p>
        <p> Remaining : {remaining}</p>
        <p> Category: {category}</p>
        <p> Deadline: {deadline}</p>
        <p> Created At: {createdAt}</p>

        <progress value={progress} max="100"></progress>
        <p>{progress}%</p>
    </div>
    )
}

export default GoalCard