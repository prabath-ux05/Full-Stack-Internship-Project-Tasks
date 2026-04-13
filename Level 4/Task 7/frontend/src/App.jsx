import { useState } from 'react'
import './index.css'

function App() {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (task.trim().length < 3) return
    
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:5005/api/task/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Analysis failed.')
      }
    } catch (err) {
      setError('Connection failed. Ensure the backend server is running on port 5005.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <header>
        <div className="status-badge">Strategy Engine v2.5</div>
        <h1>TaskInsight <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
        <p className="subtitle">Advanced structured analysis for your professional workflow.</p>
      </header>

      <div className="input-section">
        <input 
          type="text" 
          placeholder="e.g. Develop a marketing landing page..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          disabled={loading}
        />
        <button onClick={handleAnalyze} disabled={loading || task.trim().length < 3}>
          {loading ? 'Processing...' : 'Analyze Task'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results-grid">
          {/* 1. Title & Introduction */}
          <div className="full-width-card">
            <h2 className="result-title">{result.title}</h2>
            <p className="intro-text">{result.introduction}</p>
          </div>

          {/* 2. Deep Analysis */}
          <div className="analysis-card">
            <h3>📖 Deep Analysis</h3>
            <p>{result.analysis}</p>
          </div>

          {/* 3. Action Steps */}
          <div className="action-card">
            <h3>⚡ Action Steps</h3>
            <ul>
              {result.actionSteps?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 4. Process Flow (Vertical Timeline) */}
          <div className="full-width-card">
            <h3>🔄 Strategic Process Flow</h3>
            <div className="timeline-container">
              {result.flow?.map((step, idx) => (
                <div 
                  key={idx} 
                  className="timeline-item"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="node-num">{idx + 1}</div>
                  <div className="node-text">{step}</div>
                  <div className="timeline-connector"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Pros & Cons */}
          <div className="pro-card">
            <h3>✅ Advantages</h3>
            <ul>
              {result.pros?.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div className="con-card">
            <h3>⚠️ Considerations</h3>
            <ul>
              {result.cons?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          {/* 6. Final Suggestion */}
          <div className="full-width-card suggestion-highlight">
            <h3>💡 Final Recommendation</h3>
            <p>{result.finalSuggestion}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
