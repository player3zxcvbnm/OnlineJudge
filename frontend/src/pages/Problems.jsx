import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Problems() {
  const [problems, setProblems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/problems')
        setProblems(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProblems()
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h2>Problems</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Difficulty</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} onClick={() => navigate(`/problems/${problem._id}`)} style={{ cursor: 'pointer' }}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{problem.title}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee', color: problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red' }}>{problem.difficulty}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{problem.tags.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Problems