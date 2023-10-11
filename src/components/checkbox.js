import { useState } from "react";
import "../styles/checkbox.scss";

function CheckBox(props)
{
    // Props
    const {index,days,dayId,habitId,completed,updateCheckBox,setHabitComplete} = props;

    // State
    const [isChecked,setChecked] = useState(completed);

    // Handlers
    function handleChange()
    {
        days[index].completed = !isChecked;
        setChecked(!isChecked);
        updateCheckBox(days,habitId);
        checkForCompletion();
    }

    // Helpers
    function checkForCompletion()
    {
        for(const day of days)
        {
            if(day.completed === false)
            {
                setHabitComplete(false);
                return;
            }
        }
        setHabitComplete(true);
    }

    // JSX
    return(
        <li key={index} className="flex gap-2 hover:text-black cursor-pointer">
            <label htmlFor={"checkbox-"+dayId}>
                <input type="checkbox" name={"checkbox-"+dayId} id={"checkbox-" + dayId} checked={isChecked} onChange={handleChange}/>
                Day {index+1}
            </label>
        </li>
    );
}

export default CheckBox;