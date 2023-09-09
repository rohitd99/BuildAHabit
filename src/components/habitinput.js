import { useState } from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import styles from '../utility/style';

function HabitInput(props)
{
    // Props
    const {addHabit} = props;
    
    // States
    const [validInput,setValidInput] = useState(true);
    const [habitText,setHabitText] = useState("");

    // Handlers
    function handleClick()
    {
        if(habitText === "")
        {
            setValidInput(false);
            setTimeout(() => {
                setValidInput(true);
            },3000);

        }else{
            setValidInput(true);
            addHabit(habitText);
            setHabitText("");
        }
    }

    // JSX
    return(
        <div className={styles.habitInput}>
            <h1 className={styles.heading}>Build A Habit</h1>
            <form className={styles.form}>
              <label htmlFor='habit' className={styles.label}>Your New Habit</label>
              <div className={styles.inputcontainer}>
              <input type='text' placeholder='Name A Habit You Want To Build' className={validInput ? styles.input : styles.invalidInput} name='habit' value={habitText} onChange={(e)=> setHabitText(e.target.value)} required></input>
              <button className={styles.button} onClick={handleClick} type='button'><AiOutlinePlus></AiOutlinePlus></button>
              </div>
            </form>
          </div>
    );
}

export default HabitInput;