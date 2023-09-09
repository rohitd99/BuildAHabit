import { useState, useEffect,useRef } from 'react';
import {RiArrowDropDownLine,RiArrowDropUpLine} from 'react-icons/ri';
import {MdDelete} from 'react-icons/md';
import {FaRegPenToSquare} from 'react-icons/fa6';
import CheckBox from './checkbox';
import styles from '../utility/style';



function Habit (props)
{
    // Props 
    const {habit,deleteHabit,updateHabitName,updateCheckBox,fireConfetti} = props;

    // States
    const [isGraphOpen,setGraphOpen] = useState(false);
    const [name,setName] = useState(habit.name);
    const [validName,setValidName] = useState(true);
    const [deletePopup,setDeletePopup] = useState(false);
    const [updatePopup,setUpdatePopup] = useState(false);
    const [isComplete,setIsComplete] = useState(false);

    // Refs
    const updatePopupRef = useRef(null);
    const deletePopupRef = useRef(null);

    // Habit Completion
    useEffect(() => {
        if(isComplete)
        {
            console.log("Yay Habit Completed!!!!");
            fireConfetti();
            // setTimeout(() => {
            //     deleteHabit(habit.id);
            // },3000);
        }
    },[isComplete]);

    // Click Outside of Delete Popup
    useEffect(() => {
        
        let handler = (event) => {
            if(!deletePopupRef.current?.contains(event.target))
            {
                setDeletePopup(false);
            }
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    // Click Outside of Update Popup
    useEffect(() => {

        let handler = (event) => {
            if(!updatePopupRef.current?.contains(event.target))
            {
                setUpdatePopup(false);
            }
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    // Handlers
    function handleClickDropdown()
    {
        setGraphOpen(!isGraphOpen);
    }

    function handleClickDelete(id)
    {
        setDeletePopup(false);
        deleteHabit(id);
    }

    function handleClickUpdate(updatedName,id)
    {
        if(updatedName === "")
        {
            setValidName(false);
            setTimeout(() => {
                setValidName(true);
            },3000);

        }else{

            setUpdatePopup(false);
            updateHabitName(updatedName,id);
        }
    }

    // JSX
    return (
        <div className={styles.habit}>
            <section className={styles.habitInfo}>
                <p>{habit.name}</p>
                <div className={styles.options}>
                    <div className={styles.popupcontainer} ref={updatePopupRef}>
                        <button className={styles.updateicon} onClick={() => setUpdatePopup(prev => !prev)}>
                            <FaRegPenToSquare></FaRegPenToSquare>
                        </button>
                        {
                            updatePopup 
                            && 
                            <div className={styles.updatepopup}>
                                <input type='text' className={validName ? styles.updateinput : styles.updateinputInvalid} value={name} onChange={(e) => setName(e.target.value)}/>
                                <button className={styles.updatebtn} onClick={() => handleClickUpdate(name,habit.id)}>Change</button>
                            </div>
                        }
                    </div>
                    <div className={styles.popupcontainer} ref={deletePopupRef}>
                        <button className={styles.deleteicon} onClick={() => setDeletePopup(prev => !prev)}>
                            <MdDelete></MdDelete>
                        </button>
                        {
                            deletePopup 
                            && 
                            <div className={styles.deletepopup}>
                                <p className={styles.deletetext}>Are you sure you want to lose this habit?</p>
                                <button className={styles.deletebtn} onClick={() => handleClickDelete(habit.id)}>Delete</button>
                            </div>
                        }
                    </div>
                    <button className={styles.dropdown} onClick={handleClickDropdown}>
                    {
                        isGraphOpen ? <RiArrowDropUpLine ></RiArrowDropUpLine> : <RiArrowDropDownLine></RiArrowDropDownLine>
                    }
                    </button> 
                </div>
            </section>
            <section className={styles.graphSection}>
                {
                    isGraphOpen ?
                    <div className={styles.habitGraph}> 
                        {
                            habit.days.map((day,index) => {
                                return(
                                    <CheckBox   key={day.id} index={index} days={habit.days} dayId={day.id} completed={day.completed} 
                                                updateCheckBox={updateCheckBox} habitId={habit.id} setHabitComplete={setIsComplete}>
                                    </CheckBox>
                                );
                            })
                        }
                    </div>
                    : 
                    <></>
                }
            </section>
            <section>
                {   
                    isComplete  ? 
                                    <p className={styles.congratstext}>🎉Congrats you've successfully built a Habit🎉</p> 
                                : 
                                    <></>
                }
            </section>
        </div>
    );
}

export default Habit;