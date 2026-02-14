import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard / General Pages
import StudentDashboard from './pages/StudentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Complaints from './pages/Complaints';

// Student Specific
import StudentProfile from './pages/StudentProfile';
import StudentRoom from './pages/StudentRoom';
import StudentPayments from './pages/StudentPayments';
import LeaveApplications from './pages/LeaveApplications';

// Manager Specific
import ManagerStudents from './pages/ManagerStudents';
import ManagerHostels from './pages/ManagerHostels';
import ManagerLeaves from './pages/ManagerLeaves';
import Inventory from './pages/Inventory';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', padding: '5rem' }}>
    <h1>403 - Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentProfile /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/room" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentRoom /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/payments" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentPayments /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/leaves" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><LeaveApplications /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/complaints" element={
            <ProtectedRoute roles={['student', 'manager', 'staff']}>
              <DashboardLayout><Complaints /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><ManagerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/students" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><ManagerStudents /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/hostels" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><ManagerHostels /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/inventory" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><Inventory /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/leaves" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><ManagerLeaves /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/complaints" element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout><Complaints /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff" element={
            <ProtectedRoute roles={['staff']}>
              <DashboardLayout><StaffDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/staff/complaints" element={
            <ProtectedRoute roles={['staff']}>
              <DashboardLayout><Complaints /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
