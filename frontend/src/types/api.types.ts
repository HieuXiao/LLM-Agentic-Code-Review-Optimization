// frontend/src/types/api.types.ts

export interface Issue {
  issue_type: string;
  severity: string;
  line: number;
  context: string;
  description: string;
}

export interface ReviewResponse {
  status: string;
  issues_found: number;
  review_result: Issue[];
  error_message: string | null;
}

export interface RepairResponse {
  status: string;
  repaired_code: string;
  explanation: string | null;
}