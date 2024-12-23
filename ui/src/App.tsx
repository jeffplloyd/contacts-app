import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Person } from 'schema';

interface Person {
  id: number
  name: string
  age: number
}

function App() {
  const [person, setPerson] = useState<Person | null>();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    getPerson();
  },[]);

  const getPerson = async () => {
    const response = await fetch('http://localhost:3000/people/2');
    const data = await response.json();
    const result = Person.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid person data: ${result.error}`);
    }
    setPerson(result.data);
  }

  return (
    <>
      { person && <h1>Hello {person.name}!</h1> }
    </>
  )
}

export default App
