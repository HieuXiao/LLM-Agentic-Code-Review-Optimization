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