import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ProblemDetail() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`)
        setProblem(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProblem()
  }, [id])

  if (!problem) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h2>{problem.title}</h2>
      <p>Difficulty: <span style={{ color: problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red' }}>{problem.difficulty}</span></p>
      <p>Time Limit: {problem.timeLimit}ms | Memory Limit: {problem.memoryLimit}MB</p>
      <hr />
      <h3>Problem Statement</h3>
      <p>{problem.statement}</p>
      <hr />
      <h3>Tags</h3>
      <p>{problem.tags.join(', ')}</p>
    </div>
  )
}

export default ProblemDetail