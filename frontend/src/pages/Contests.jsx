import { API_BASE } from '../api/config'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/pages.css'

function Contests() {
  const [contests, setContests] = useState([])
  const [tab, setTab] = useState('live')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/contests?status=${tab}`)
        setContests(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchContests()
  }, [tab])

  return (
    <div className="page-container">
      <h2 className="page-title">Contests</h2>
      <div className="tab-group">
        {['live', 'upcoming', 'archived'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {contests.length === 0 && (
            <tr><td colSpan="3" style={{ color: '#666', textAlign: 'center', padding: '32px' }}>No {tab} contests</td></tr>
          )}
          {contests.map((contest) => (
            <tr key={contest._id} onClick={() => navigate(`/contests/${contest._id}`)} style={{ cursor: 'pointer' }}>
              <td>{contest.title}</td>
              <td style={{ color: '#888', fontSize: '13px' }}>{new Date(contest.startTime).toLocaleString()}</td>
              <td style={{ color: '#888', fontSize: '13px' }}>{new Date(contest.endTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Contests


