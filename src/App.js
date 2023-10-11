import React from 'react';
import { useState,useEffect,useRef,useCallback } from 'react';
import HabitInput from './components/habitinput';
import Habit from './components/habit';
import { initializeApp } from "firebase/app";
import { getFirestore,collection,query,onSnapshot,addDoc,serverTimestamp,orderBy,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion"
import ReactCanvasConfetti from 'react-canvas-confetti';

function App() {

    // Habits Array
    const [Habits,setHabits] = useState([]);

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCuJ6CBp7MaujDtGiJ4Aqk9NmNmpWQk8ik",
        authDomain: "buildahabit-54d14.firebaseapp.com",
        projectId: "buildahabit-54d14",
        storageBucket: "buildahabit-54d14.appspot.com",
        messagingSenderId: "343376072851",
        appId: "1:343376072851:web:0f096249395634ab9dfd66",
        measurementId: "G-MYS7LWMFLK"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize db
    const db = getFirestore(app);

    // Read Habits
    useEffect(() => {
        const q = query(collection(db,'habits'),orderBy('createdAt'));
        const unsubscribe = onSnapshot(q,(querySnapshot) => {
        let habitsArr = [];
        querySnapshot.forEach((doc) => {
            habitsArr.push({...doc.data(),id : doc.id})
        });
        setHabits(habitsArr);
        });
        return () => unsubscribe();
    },[]);
    

    // Add Habit to Database.
    const addHabit = async (habitText) => {

        const days = [];
        for(let i = 0;i < 21;i++)
        {
        days.push({
            id: uuidv4(),
            completed: false
        });
        }

        await addDoc(collection(db,'habits'),{
        createdAt: serverTimestamp(),
        name: habitText,
        days: days
        });  
    };

    // Delete a Habit
    const deleteHabit = async (id) => {
        await deleteDoc(doc(db,'habits',id));
    };
    
    // Update a Habit Name
    const updateHabitName = async (updatedName,id) => {
        await updateDoc(doc(db,'habits',id), {
            name: updatedName
        });  
    };
    
    // Update Habit checkbox
    const updateCheckBox = async (updatedDays,id) => {
        await updateDoc(doc(db,'habits',id),{
        days: updatedDays
        })
    };
    
    // Fire Confetti
    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
        refAnimationInstance.current({
            ...opts,
            particleCount: Math.floor(200 * particleRatio)
        });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.25, {
        spread: 26,
        startVelocity: 55,
        origin: { x:0,y: 0.75}
        });

        makeShot(0.2, {
        spread: 60,
        startVelocity: 75,
        origin: { x:0,y: 0.75}
        });

        makeShot(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        startVelocity: 75,
        origin: { x:0,y: 0.75}
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 55,
        decay: 0.92,
        scalar: 1.2,
        origin: { x:0,y: 0.75}
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 45,
        origin: { x:0,y: 0.75}
        });

        makeShot(0.25, {
        spread: 56,
        startVelocity: 55,
        origin: { x:1,y: 0.75}
        });

        makeShot(0.2, {
        spread: 60,
        startVelocity: 75,
        origin: { x:1,y: 0.75}
        });

        makeShot(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        startVelocity: 75,
        origin: { x:1,y: 0.75}
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 55,
        decay: 0.92,
        scalar: 1.2,
        origin: { x:1,y: 0.75}
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 45,
        origin: { x:0,y: 0.75}
        });
    }, [makeShot]);

    // JSX
    return (
        <div className="min-h-[100vh] bg-gradient-to-r from-indigo-800 to-indigo-900">
        <header></header>
        <main className="flex justify-center p-4 md:p-12 lg:p-14">
            <div className="max-w-[800px] w-full flex flex-col gap-4">
                <HabitInput addHabit={addHabit}></HabitInput>
                <div className="flex flex-col gap-4">
                    {
                        <AnimatePresence>
                        {
                            Habits.map((habit) => {
                                return(
                                <Habit key={habit.id} habit={habit} deleteHabit={deleteHabit} updateHabitName={updateHabitName} updateCheckBox={updateCheckBox} fireConfetti={fire}>
                                </Habit>);
                            })
                        }
                        </AnimatePresence>
                    }
                </div>
            </div>
        </main>
        <footer></footer>
        <ReactCanvasConfetti refConfetti={getInstance} className="w-full h-full pointer-events-none fixed top-0 left-0"></ReactCanvasConfetti>
        </div>
);
}

export default App;
