import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Contests() {
  const [contests, setContests] = useState([])
  const [tab, setTab] = useState('live')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contests?status=${tab}`)
        setContests(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchContests()
  }, [tab])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h2>Contests</h2>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        {['live', 'upcoming', 'archived'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              background: tab === t ? '#4CAF50' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textTransform: 'capitalize'
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Start</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>End</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest._id} onClick={() => navigate(`/contests/${contest._id}`)} style={{ cursor: 'pointer' }}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{contest.title}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(contest.startTime).toLocaleString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(contest.endTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Contests