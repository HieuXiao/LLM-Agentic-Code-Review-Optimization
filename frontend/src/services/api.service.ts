// services/api.service.ts

import axios from 'axios';
import type { ReviewResponse, RepairResponse, Issue } from '../types/api.types';

const API_URL = 'http://127.0.0.1:8000/api'; 

export const reviewCode = async (sourceCode: string, language: string = 'python'): Promise<ReviewResponse> => {
  try {
    const response = await axios.post<ReviewResponse>(`${API_URL}/review`, {
      source_code: sourceCode,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API Review:", error);
    throw error;
  }
};

export const repairCode = async (sourceCode: string, reviewIssues: Issue[], language: string = 'python'): Promise<RepairResponse> => {
    try {
      const response = await axios.post<RepairResponse>(`${API_URL}/repair`, {
        source_code: sourceCode,
        review_issues: reviewIssues,
        language: language
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API Repair:", error);
      throw error;
    }
};

export const streamRepairCode = async (
    sourceCode: string, 
    reviewIssues: Issue[], 
    language: string = 'python',
    onChunk: (text: string) => void
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/repair/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        source_code: sourceCode,
        review_issues: reviewIssues,
        language: language
      }),
    });
  
    if (!response.body) throw new Error("Trình duyệt không hỗ trợ luồng dữ liệu (ReadableStream).");
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n'); // Tách các event SSE
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          let data = line.replace('data: ', '');
          if (data.startsWith('[ERROR]')) {
              throw new Error(data.replace('[ERROR] ', ''));
          }
          // Khôi phục lại dấu xuống dòng
          data = data.replace(/\\n/g, '\n');
          onChunk(data);
        }
      }
    }
  };