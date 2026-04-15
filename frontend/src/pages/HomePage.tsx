// frontend/src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Play, AlertTriangle, CheckCircle, Code } from 'lucide-react';
import { reviewCode, repairCode } from '../services/api.service';
import type { Issue } from '../types/api.types';

export const HomePage: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repairedCode, setRepairedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleRunAgent = async () => {
    if (!sourceCode.trim()) {
      setError("Vui lòng nhập mã nguồn trước khi chạy AI!");
      return;
    }

    setLoading(true);
    setError(null);
    setIssues([]);
    setRepairedCode('');

    try {
      // Bước 1: Gọi API Review
      const reviewData = await reviewCode(sourceCode, language);
      setIssues(reviewData.review_result || []);

      // Bước 2: Nếu có lỗi, tự động gọi API Repair
      if (reviewData.issues_found > 0 && reviewData.review_result) {
        const repairData = await repairCode(sourceCode, reviewData.review_result, language);
        if (repairData.status === 'success') {
          setRepairedCode(repairData.repaired_code);
        } else {
          setError(repairData.explanation || "Không thể tạo bản sửa lỗi.");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Đã xảy ra lỗi khi kết nối với máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0d1117', color: '#c9d1d9', fontFamily: 'sans-serif' }}>
      
      {/* KHUNG BÊN TRÁI: CODE INPUT */}
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#58a6ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code /> 👨‍💻 Code Viewer
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px' }}>Ngôn ngữ:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', backgroundColor: '#21262d', color: '#fff', border: '1px solid #30363d' }}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>

        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          placeholder="Dán mã nguồn của bạn vào đây..."
          style={{ 
            flex: 1, padding: '15px', borderRadius: '10px', backgroundColor: '#010409', color: '#e6edf3',
            border: '1px solid #30363d', fontFamily: 'monospace', fontSize: '14px', resize: 'none'
          }}
        />
      </div>

      {/* KHUNG BÊN PHẢI: AI PANEL */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h2 style={{ color: '#58a6ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🤖 AI Review Panel
        </h2>

        <button 
          onClick={handleRunAgent}
          disabled={loading}
          style={{
            padding: '12px 20px', backgroundColor: loading ? '#21262d' : '#238636', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', marginBottom: '20px'
          }}
        >
          {loading ? '⏳ AI đang phân tích...' : <><Play size={18} /> Run Review & Repair Agent</>}
        </button>

        {error && (
          <div style={{ padding: '15px', backgroundColor: 'rgba(248, 81, 73, 0.1)', borderLeft: '4px solid #f85149', color: '#ff7b72', marginBottom: '20px' }}>
            <AlertTriangle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/>
            {error}
          </div>
        )}

        {/* HIỂN THỊ DANH SÁCH LỖI */}
        {issues.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>Detected Issues ({issues.length})</h3>
            {issues.map((issue, index) => (
              <div key={index} style={{ padding: '15px', backgroundColor: '#161b22', borderRadius: '8px', marginBottom: '10px', border: '1px solid #30363d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: issue.severity === 'Critical' ? '#f85149' : '#e3b341' }}>
                    {index + 1}. {issue.issue_type}
                  </strong>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#21262d' }}>
                    Dòng {issue.line}
                  </span>
                </div>
                <code style={{ display: 'block', backgroundColor: '#0d1117', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#ff7b72' }}>
                  {issue.context}
                </code>
                <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>{issue.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* HIỂN THỊ CODE ĐÃ SỬA */}
        {repairedCode && (
          <div>
            <h3 style={{ borderBottom: '1px solid #30363d', paddingBottom: '10px', color: '#3fb950', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} /> Repaired Code
            </h3>
            <pre style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#010409', border: '1px solid #30363d', overflowX: 'auto', color: '#e6edf3' }}>
              <code>{repairedCode}</code>
            </pre>
          </div>
        )}
        
        {!loading && issues.length === 0 && !error && (
           <p style={{ color: '#8b949e', fontStyle: 'italic' }}>Hãy nhập code và bấm chạy AI để xem kết quả.</p>
        )}

      </div>
    </div>
  );
};