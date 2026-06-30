import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ContestDetail() {
  const { id } = useParams()
  const [contest, setContest] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contests/${id}`)
        setContest(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchContest()
  }, [id])

  if (!contest) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '6px 14px', cursor: 'pointer' }}>← Back</button>
      <h2>{contest.title}</h2>
      <p>{contest.description}</p>
      <p>{new Date(contest.startTime).toLocaleString()} — {new Date(contest.endTime).toLocaleString()}</p>
      <hr />
      <h3>Problems</h3>
      <ul>
        {contest.problems.map((p) => (
          <li key={p._id} onClick={() => navigate(`/problems/${p._id}`)} style={{ cursor: 'pointer', padding: '8px 0' }}>
            {p.title} - {p.difficulty}
          </li>
        ))}
      </ul>
      <hr />
      <button onClick={() => navigate(`/leaderboard/${contest._id}`)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        View Leaderboard
      </button>
    </div>
  )
}

export default ContestDetail