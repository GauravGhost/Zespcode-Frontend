const environment = "production";
const PROBLEM_BASE_URL = environment ? "https://zespproblem.zesp.in" : "http://localhost:3000";
const SUBMISSION_BASE_URL = environment ? "https://zespsubmission.zesp.in" : "http://localhost:5000";
export const SOCKET_URL = environment ? "https://zespsocket.zesp.in" : "http://localhost:3005";

export const GET_ALL_PROBLEMS = () => `${PROBLEM_BASE_URL}/api/v1/problems`;
export const GET_PROBLEM_BY_ID = (id: string = "") => `${PROBLEM_BASE_URL}/api/v1/problems/query?id=${id}`;
export const GET_PROBLEM_BY_TITLE_SLUG = (id: string = "") => `${PROBLEM_BASE_URL}/api/v1/problems/query?titleSlug=${id}`;

export const GET_ALL_PROBLEM_LIST = () => `${PROBLEM_BASE_URL}/api/v1/problems/all`

export const CREATE_SUBMISSION = () => `${SUBMISSION_BASE_URL}/api/v1/submissions`;