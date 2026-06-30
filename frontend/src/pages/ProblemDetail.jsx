import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Editor from '@monaco-editor/react'

function ProblemDetail() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('// Write your solution here')
  const [language, setLanguage] = useState('cpp')
  const navigate = useNavigate()

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post('http://localhost:5000/api/submissions', {
      problemId: id,
      code,
      language
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const submissionId = res.data.submissionId
    
    const interval = setInterval(async () => {
      const verdictRes = await axios.get(`http://localhost:5000/api/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const verdict = verdictRes.data.verdict
      if (verdict !== 'PENDING') {
        clearInterval(interval)
        alert(`Verdict: ${verdict}`)
      }
    }, 2000)

  } catch (err) {
    alert('Submission failed')
    console.log(err)
  }
}

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
    <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
      <div style={{ width: '40%', padding: '20px', overflowY: 'auto', borderRight: '1px solid #333' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '6px 14px', cursor: 'pointer' }}>← Back</button>
        <h2>{problem.title}</h2>
        <p>Difficulty: <span style={{ color: problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'orange' : 'red' }}>{problem.difficulty}</span></p>
        <p>Time Limit: {problem.timeLimit}ms | Memory Limit: {problem.memoryLimit}MB</p>
        <hr />
        <h3>Problem Statement</h3>
        <p>{problem.statement}</p>
        <hr />
        <p>Tags: {problem.tags.join(', ')}</p>
      </div>

      <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px', background: '#1e1e1e', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '5px', background: '#333', color: 'white', border: 'none' }}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button onClick={handleSubmit} style={{ padding: '5px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Submit
          </button>
        </div>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </div>
    </div>
  )
}

export default ProblemDetail