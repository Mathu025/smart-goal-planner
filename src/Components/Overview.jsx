import React from 'react'
import { differenceInDays, parseISO} from "date-fns"

const Overview = ({goals}) => {
    const totalGoals = goals.length
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0)
    const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length

    const getTimeLeft = (goal) => {
        const now = new Date();
        const deadlineDate = parseISO(goal.deadline)
        const diffDays = differenceInDays(deadlineDate, now)
        const isComplete = goal.savedAmount >= goal.targetAmount

        if (diffDays < 0 && !isComplete) {
            return "Overdue!"
        } else if (diffDays >= 0 && diffDays <= 30 && !isComplete) { 
            return `${diffDays}  day(s) left - WARNING: Deadline Approaching`
        } else if (diffDays < 0 && isComplete) {
            return "Completed!"
        } else {
            return `${diffDays} day(s) left!`
        }
    }

    return (
        <div>
            <h2>Overview</h2>
            <p>Total Number Of Goals: {totalGoals} </p>
            <p>Total Amount Saved: {totalSaved}</p>
            <p>Goals Completed: {completedGoals}</p>

            <h3>Time left for each goal</h3>
            <ul>
                {goals.map(goal => (
                    <li key={goal.id}> 
                        {goal.name} : {getTimeLeft(goal)}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Overview