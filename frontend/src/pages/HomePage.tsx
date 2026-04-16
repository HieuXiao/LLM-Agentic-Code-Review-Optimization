// frontend/src/pages/HomePage.tsx

import React, { useState } from 'react';
import { Play, CheckCircle, Code } from 'lucide-react';
// Đã thay đổi: Import streamRepairCode thay vì repairCode
import { reviewCode, streamRepairCode } from '../services/api.service';
import type { Issue } from '../types/api.types';

// Import thư viện Toast và Highlight Code
import toast, { Toaster } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const HomePage: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repairedCode, setRepairedCode] = useState<string>('');

  const handleRunAgent = async () => {
    if (!sourceCode.trim()) {
      toast.error("Vui lòng nhập mã nguồn trước khi chạy AI!");
      return;
    }

    setLoading(true);
    setIssues([]);
    setRepairedCode('');
    
    // Bật thông báo Toast đang xử lý
    const toastId = toast.loading('AI đang phân tích mã nguồn...');

    try {
      const reviewData = await reviewCode(sourceCode, language);
      setIssues(reviewData.review_result || []);

      if (reviewData.issues_found > 0 && reviewData.review_result) {
        toast.loading('Phát hiện lỗi! AI đang bắt đầu gõ mã sửa chữa...', { id: toastId });
        
        // Gọi API Stream và cập nhật UI liên tục
        await streamRepairCode(
          sourceCode, 
          reviewData.review_result, 
          language, 
          (chunk) => {
            // Cộng dồn từng đoạn code mới trả về vào state
            setRepairedCode(prev => prev + chunk);
          }
        );
        
        toast.success('Đã hoàn tất phân tích và sửa lỗi!', { id: toastId });
      } else {
        toast.success('Code của bạn rất tuyệt, không tìm thấy lỗi nào!', { id: toastId });
      }
    } catch (err: any) {
      // Bắt lỗi chung cho cả Review và Stream Repair
      const errorMsg = err.response?.data?.detail || err.message || "Đã xảy ra lỗi khi kết nối với máy chủ.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0d1117', color: '#c9d1d9', fontFamily: 'sans-serif' }}>
      {/* Component chứa các Pop-up thông báo */}
      <Toaster position="top-right" toastOptions={{ style: { background: '#161b22', color: '#c9d1d9', border: '1px solid #30363d' } }} />

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
          {loading ? '⏳ Xin chờ...' : <><Play size={18} /> Run Review & Repair Agent</>}
        </button>

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
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#21262d' }}>Dòng {issue.line}</span>
                </div>
                <code style={{ display: 'block', backgroundColor: '#0d1117', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#ff7b72' }}>
                  {issue.context}
                </code>
                <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>{issue.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* HIỂN THỊ CODE ĐÃ SỬA VỚI SYNTAX HIGHLIGHTING */}
        {repairedCode && (
          <div>
            <h3 style={{ borderBottom: '1px solid #30363d', paddingBottom: '10px', color: '#3fb950', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} /> Repaired Code
            </h3>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #30363d' }}>
              <SyntaxHighlighter 
                language={language} 
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '15px', fontSize: '14px' }}
              >
                {repairedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};