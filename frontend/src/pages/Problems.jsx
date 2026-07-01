import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/pages.css'

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

  const diffClass = (d) => d === 'Easy' ? 'badge-easy' : d === 'Medium' ? 'badge-medium' : 'badge-hard'

  return (
    <div className="page-container">
      <h2 className="page-title">Problems</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} onClick={() => navigate(`/problems/${problem._id}`)} style={{ cursor: 'pointer' }}>
              <td>{problem.title}</td>
              <td><span className={diffClass(problem.difficulty)}>{problem.difficulty}</span></td>
              <td style={{ color: '#666', fontSize: '13px' }}>{problem.tags.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Problems