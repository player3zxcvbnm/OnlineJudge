import { API_BASE } from '../api/config'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Editor from '@monaco-editor/react'
import '../styles/pages.css'

function ProblemDetail() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('// Write your solution here')
  const [language, setLanguage] = useState('cpp')
  const [verdict, setVerdict] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [outputError, setOutputError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/problems/${id}`)
        setProblem(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProblem()
  }, [id])

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setVerdict('PENDING')
      const token = localStorage.getItem('token')
      const res = await axios.post(API_BASE + '/api/submissions', {
        problemId: id, code, language
      }, { headers: { Authorization: `Bearer ${token}` } })

      const submissionId = res.data.submissionId
      const interval = setInterval(async () => {
        const verdictRes = await axios.get(`${API_BASE}/api/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const v = verdictRes.data.verdict
        if (v !== 'PENDING') {
          clearInterval(interval)
          setVerdict(v)
          setSubmitting(false)
        }
      }, 2000)
    } catch (err) {
      setVerdict('ERROR')
      setSubmitting(false)
      console.log(err)
    }
  }

  const handleRun = async () => {
    try {
      setRunning(true)
      setOutput('')
      const token = localStorage.getItem('token')
      const res = await axios.post(API_BASE + '/api/execute', {
        code, language, input: customInput
      }, { headers: { Authorization: `Bearer ${token}` } })
      setOutput(res.data.output)
      setOutputError(res.data.isError)
    } catch (err) {
      setOutput('Execution failed')
      setOutputError(true)
      console.log(err)
    } finally {
      setRunning(false)
    }
  }

  if (!problem) return <div className="page-container"><p>Loading...</p></div>

  const diffClass = problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
  const verdictClass = verdict === 'AC' ? 'badge-ac' : verdict === 'PENDING' ? 'badge-pending' : verdict ? 'badge-fail' : ''

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>

      {/* Left panel - problem */}
      <div style={{ width: '42%', padding: '24px', overflowY: 'auto', borderRight: '1px solid #2a2a2a', background: '#0f0f0f' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{problem.title}</h2>
        <p style={{ marginBottom: '16px' }}>
          <span className={diffClass}>{problem.difficulty}</span>
          <span style={{ color: '#555', fontSize: '13px', marginLeft: '12px' }}>
            {problem.timeLimit}ms · {problem.memoryLimit}MB
          </span>
        </p>
        <hr />
        <div style={{ marginTop: '16px', lineHeight: '1.8', color: '#ccc', fontSize: '14px' }}>
          {problem.statement}
        </div>
        <hr style={{ marginTop: '20px' }} />
        <p style={{ fontSize: '13px', color: '#555', marginTop: '12px' }}>
          Tags: {problem.tags.join(', ')}
        </p>
      </div>

      {/* Right panel - editor + run */}
      <div style={{ width: '58%', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>

        {/* Toolbar */}
        <div style={{ padding: '10px 16px', background: '#141414', borderBottom: '1px solid #2a2a2a', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: 'auto', marginBottom: 0, background: '#1e1e1e', border: '1px solid #333', color: '#e0e0e0', padding: '5px 10px', borderRadius: '6px' }}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button
            onClick={handleRun}
            disabled={running}
            style={{ padding: '6px 16px', background: '#333', color: '#e0e0e0', border: '1px solid #444', borderRadius: '6px', opacity: running ? 0.6 : 1 }}
          >
            {running ? 'Running...' : 'Run'}
          </button>

          <button
            className="btn-success"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Judging...' : 'Submit'}
          </button>

          {verdict && (
            <span className={verdictClass} style={{ fontSize: '14px', fontWeight: '600' }}>
              {verdict}
            </span>
          )}
        </div>

        {/* Editor */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>

        {/* Custom input + output */}
        <div style={{ borderTop: '1px solid #2a2a2a', background: '#141414', padding: '12px 16px', display: 'flex', gap: '12px', height: '180px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Input</p>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type your input here..."
              style={{ flex: 1, background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#e0e0e0', borderRadius: '6px', padding: '8px', fontSize: '13px', fontFamily: 'Consolas, monospace', resize: 'none', outline: 'none', width: '100%', marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Output</p>
            <div style={{ flex: 1, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px', fontSize: '13px', fontFamily: 'Consolas, monospace', color: outputError ? '#e05555' : '#2ea043', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {output || <span style={{ color: '#444' }}>Output will appear here after Run</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProblemDetail


