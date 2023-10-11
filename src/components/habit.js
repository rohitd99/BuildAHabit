import { useState, useEffect,useRef } from 'react';
import {RiArrowDropDownLine,RiArrowDropUpLine} from 'react-icons/ri';
import {MdDelete} from 'react-icons/md';
import {FaRegPenToSquare} from 'react-icons/fa6';
import { motion, AnimatePresence } from "framer-motion"
import CheckBox from './checkbox';

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
            fireConfetti();
            setTimeout(() => {
                deleteHabit(habit.id);
            },1000);
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
        <motion.div className="relative w-full bg-neutral-50 rounded-lg text-gray-500 flex flex-col"
                    initial={{
                        y: -50,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition:{
                            duration: 1,
                            delay: 0.2
                        }
                    }}
                    exit={{ opacity: 0 , transition:{
                        opacity:{
                            duration: 0.5
                        }
                    }}}
        >
            <section className="flex justify-between p-4">
                <p>{habit.name}</p>
                <div className="text-3xl flex items-center gap-2">
                    <div className="relative" ref={updatePopupRef}>
                        <button className="text-xl text-sky-500 rounded-md cursor-pointer focus:scale-110" onClick={() => setUpdatePopup(prev => !prev)}>
                            <FaRegPenToSquare></FaRegPenToSquare>
                        </button>
                        {
                            updatePopup 
                            && 
                            <div className="absolute flex flex-col shadow-md gap-2 bottom-8 right-1 p-2 bg-white rounded-md text-sm text-gray-700 z-10 border-8 border-solid border-white border-t-transparent border-r-transparent border-l-transparent border-b-white animate-fade-up animate-duration-1000">
                                <input type='text' className={validName ? "border-2 border-slate-500 p-2 focus:border-black rounded-md" : "border-2 border-red-500 p-2 focus:border-black rounded-md"} value={name} onChange={(e) => setName(e.target.value)}/>
                                <button className="text-center text-white bg-sky-500 rounded-lg p-1 hover:scale-95 focus:outline-2 focus:outline-sky-700 focus:outline-double ease-in transition duration-150 ease-in hover:ease-in" onClick={() => handleClickUpdate(name,habit.id)}>Change</button>
                            </div>
                        }
                    </div>
                    <div className="relative" ref={deletePopupRef}>
                        <button className="text-xl text-white bg-red-500 border-2 border-red-500 rounded-md cursor-pointer focus:outline-2 focus:outline-red-700 focus:outline-double" onClick={() => setDeletePopup(prev => !prev)}>
                            <MdDelete></MdDelete>
                        </button>
                        {
                            deletePopup 
                            && 
                            <div className="absolute w-72 flex flex-col shadow-md gap-2 bottom-8 right-1 p-2 bg-white rounded-md text-sm text-gray-700 z-10 border-8 border-solid border-white border-t-transparent border-r-transparent border-l-transparent border-b-white animate-fade-up animate-duration-1000">
                                <p className="text-sm">Are you sure you want to lose this habit?</p>
                                <button className="text-center text-white bg-red-500 rounded-lg p-1 hover:scale-95 focus:outline-2 focus:outline-red-700 focus:outline-double ease-in transition duration-150 ease-in hover:ease-in" onClick={() => handleClickDelete(habit.id)}>Delete</button>
                            </div>
                        }
                    </div>
                    <button className="text-3xl focus:scale-110" onClick={handleClickDropdown}>
                    {
                        isGraphOpen ? <RiArrowDropUpLine ></RiArrowDropUpLine> : <RiArrowDropDownLine></RiArrowDropDownLine>
                    }
                    </button> 
                </div>
            </section>
            <section className="w-full self-start">
                <AnimatePresence>
                {
                    isGraphOpen &&
                    <motion.div className="text-sm sm:text-md grid grid-rows-7 grid-cols-3 sm:grid-rows-6 sm:grid-cols-4 md:grid-rows-5 md:grid-cols-5 lg:grid-rows-4 lg:grid-cols-6 grid-flow-col gap-2 p-4" > 
                        {
                            habit.days.map((day,index) => {
                                return(
                                    <CheckBox   key={day.id} index={index} days={habit.days} dayId={day.id} completed={day.completed} 
                                                updateCheckBox={updateCheckBox} habitId={habit.id} setHabitComplete={setIsComplete}>
                                    </CheckBox>
                                );
                            })
                        }
                    </motion.div>
                }
                </AnimatePresence>
            </section>
            <section>
                {   
                    isComplete  ? 
                                    <p className="text-lg md:text-2xl text-center text-black p-2 pb-6 animate-fade-down animate-duration-1000">🎉Congrats you've successfully built a Habit🎉</p> 
                                : 
                                    <></>
                }
            </section>
        </motion.div>
    );
}

export default Habit;