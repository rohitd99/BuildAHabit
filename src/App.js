import React from 'react';
import { useState,useEffect,useRef,useCallback } from 'react';
import HabitInput from './components/habitinput';
import Habit from './components/habit';
import { initializeApp } from "firebase/app";
import { getFirestore,collection,query,onSnapshot,addDoc,serverTimestamp,orderBy,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import ReactCanvasConfetti from 'react-canvas-confetti';
import styles  from './utility/style';

function App() {

    // Habits Array
    const [Habits,setHabits] = useState([]);

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAU0k0ptoGaTS7tMNArOQEKcQdVkCbAP3g",
        authDomain: "buildahabit-1e93e.firebaseapp.com",
        projectId: "buildahabit-1e93e",
        storageBucket: "buildahabit-1e93e.appspot.com",
        messagingSenderId: "569686856715",
        appId: "1:569686856715:web:e9d9a99de2b07cf933230e"
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
        <div className={styles.app}>
        <header></header>
        <main className={styles.main}>
            <div className={styles.container}>
            <HabitInput addHabit={addHabit}></HabitInput>
            <div className={styles.habitsContainer}>
                {
                Habits.map((habit) => {
                    return(
                    <Habit key={habit.id} habit={habit} deleteHabit={deleteHabit} updateHabitName={updateHabitName} updateCheckBox={updateCheckBox} fireConfetti={fire}>
                    </Habit>);
                })
                }
            </div>
            </div>
        </main>
        <footer></footer>
        <ReactCanvasConfetti refConfetti={getInstance} className={styles.confettiCanvas}></ReactCanvasConfetti>
        </div>
);
}

export default App;
