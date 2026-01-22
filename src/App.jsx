import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Copy your existing styles object here from your original App.jsx
const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  content: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '16px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  buttonPrimary: {
    background: '#667eea',
    color: 'white'
  },
  buttonDanger: {
    background: '#ef4444',
    color: 'white'
  },
  buttonSecondary: {
    background: '#e5e7eb',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    background: 'white'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  th: {
    background: '#f9fafb',
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '13px'
  },
  td: {
    padding: '12px 8px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '13px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    overflow: 'auto'
  },
  modalContent: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    margin: '20px'
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  alertSuccess: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7'
  },
  alertError: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5'
  },
  alertInfo: {
    background: '#dbeafe',
    color: '#1e40af',
    border: '1px solid #93c5fd'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '4px',
    borderRadius: '4px',
    fontSize: '18px',
    transition: 'background 0.3s'
  },
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  filterBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '16px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#667eea'
  }
};

export default function StudentManagementSystem() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Auth fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // Filter fields
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [mentorFilter, setMentorFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorStaffId, setMentorStaffId] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const genders = ['Male', 'Female', 'Other'];

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get ID token with force refresh to get latest custom claims
          const token = await firebaseUser.getIdToken(true);
          const idTokenResult = await firebaseUser.getIdTokenResult();
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: idTokenResult.claims.role || 'student' // Get role from custom claims
          };
          
          setUser(userData);
          setIdToken(token);
          setShowAuth(false);
          
          console.log('User logged in:', userData);
        } catch (err) {
          console.error('Error getting user token:', err);
          setError('Failed to authenticate user');
        }
      } else {
        setUser(null);
        setIdToken(null);
        setShowAuth(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && idToken) {
      loadStudents();
    }
  }, [user, idToken]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, departmentFilter, yearFilter, mentorFilter, genderFilter]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    if (!authEmail || !authPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setSuccess('Logged in successfully!');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed';
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStudents([]);
      clearFilters();
      setSuccess('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  const loadStudents = async () => {
    if (!idToken) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (departmentFilter) params.append('department', departmentFilter);
      if (yearFilter) params.append('year', yearFilter);
      if (mentorFilter) params.append('mentor_name', mentorFilter);
      if (genderFilter) params.append('gender', genderFilter);

      const response = await fetch(`${API_BASE_URL}/students/?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          await handleLogout();
          return;
        }
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
      setError(`Failed to load students: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(term) ||
        s.roll_number?.toLowerCase().includes(term) ||
        s.school_email?.toLowerCase().includes(term) ||
        s.personal_email?.toLowerCase().includes(term) ||
        s.mentor_name?.toLowerCase().includes(term)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(s => s.department === departmentFilter);
    }

    if (yearFilter) {
      filtered = filtered.filter(s => s.year === yearFilter);
    }

    if (mentorFilter) {
      filtered = filtered.filter(s => s.mentor_name?.toLowerCase().includes(mentorFilter.toLowerCase()));
    }

    if (genderFilter) {
      filtered = filtered.filter(s => s.gender === genderFilter);
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setYearFilter('');
    setMentorFilter('');
    setGenderFilter('');
  };

  const validateForm = () => {
    if (!name || !rollNumber || !department || !year || !dob || !gender || 
        !phoneNumber || !schoolEmail || !personalEmail || !parentName || 
        !parentMobile || !mentorName || !mentorStaffId || !mentorEmail) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolEmail) || !emailRegex.test(personalEmail) || !emailRegex.test(mentorEmail)) {
      setError('Please enter valid email addresses');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber) || !phoneRegex.test(parentMobile)) {
      setError('Phone numbers must be 10 digits');
      return false;
    }

    return true;
  };

  const handleSaveStudent = async () => {
    if (!idToken) {
      setError('Not authenticated');
      return;
    }
    
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    const studentData = {
      name,
      roll_number: rollNumber,
      department,
      year,
      dob,
      gender,
      phone_number: phoneNumber,
      school_email: schoolEmail,
      personal_email: personalEmail,
      parent_name: parentName,
      parent_mobile: parentMobile,
      mentor_name: mentorName,
      mentor_staff_id: mentorStaffId,
      mentor_email: mentorEmail
    };

    setLoading(true);
    try {
      const url = editingStudent 
        ? `${API_BASE_URL}/students/${editingStudent.id}`
        : `${API_BASE_URL}/students/`;
      
      const response = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save student');
      }

      setSuccess(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
      closeModal();
      await loadStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!idToken) {
      setError('Not authenticated');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setSuccess('Student deleted successfully!');
      await loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.roll_number);
    setDepartment(student.department);
    setYear(student.year);
    setDob(student.dob);
    setGender(student.gender);
    setPhoneNumber(student.phone_number);
    setSchoolEmail(student.school_email);
    setPersonalEmail(student.personal_email);
    setParentName(student.parent_name);
    setParentMobile(student.parent_mobile);
    setMentorName(student.mentor_name);
    setMentorStaffId(student.mentor_staff_id);
    setMentorEmail(student.mentor_email);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setRollNumber('');
    setDepartment('');
    setYear('');
    setDob('');
    setGender('');
    setPhoneNumber('');
    setSchoolEmail('');
    setPersonalEmail('');
    setParentName('');
    setParentMobile('');
    setMentorName('');
    setMentorStaffId('');
    setMentorEmail('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setError('');
  };

  const canEdit = user?.role === 'admin';

  if (showAuth) {
    return (
      <div style={styles.authContainer}>
        <div style={{ ...styles.card, width: '100%', maxWidth: '400px', margin: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h2>
          
          {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
          {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>}
          
          <input
            type="email"
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={styles.input}
            disabled={loading}
          />
          
          <button
            onClick={handleLogin}
            style={{ ...styles.button, ...styles.buttonPrimary, width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div style={{ ...styles.alert, ...styles.alertInfo, marginTop: '16px', fontSize: '12px' }}>
            Contact your administrator to create an account. Only authorized users can access this system.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Student Database Management System</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>{user?.email} ({user?.role})</span>
          <button
            onClick={handleLogout}
            style={{ ...styles.button, ...styles.buttonDanger }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
        {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>}

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Students ({filteredStudents.length})</h2>
          {canEdit && (
            <button
              onClick={openAddModal}
              style={{ ...styles.button, ...styles.buttonPrimary }}
              disabled={loading}
            >
              + Add Student
            </button>
          )}
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Filters & Search</h3>
            <button
              onClick={clearFilters}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Clear Filters
            </button>
          </div>
          
          <div style={styles.filterBar}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Search</label>
              <input
                type="text"
                placeholder="Search by name, roll no, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ ...styles.select, marginBottom: 0 }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                style={{ ...styles.select, marginBottom: 0 }}
              >
                <option value="">All Years</option>
                {years.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{ ...styles.select, marginBottom: 0 }}
              >
                <option value="">All Genders</option>
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Mentor</label>
              <input
                type="text"
                placeholder="Search by mentor name..."
                value={mentorFilter}
                onChange={(e) => setMentorFilter(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              />
            </div>
          </div>
        </div>

        {loading && <div style={styles.loading}>Loading...</div>}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Roll No</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Year</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>DOB</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>School Email</th>
                <th style={styles.th}>Personal Email</th>
                <th style={styles.th}>Parent Name</th>
                <th style={styles.th}>Parent Mobile</th>
                <th style={styles.th}>Mentor Name</th>
                <th style={styles.th}>Mentor ID</th>
                <th style={styles.th}>Mentor Email</th>
                {canEdit && <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 15 : 14} style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                    {students.length === 0 ? 'No students found. Click "Add Student" to get started.' : 'No students match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={styles.td}>{student.roll_number}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.department}</td>
                    <td style={styles.td}>{student.year}</td>
                    <td style={styles.td}>{student.gender}</td>
                    <td style={styles.td}>{student.dob}</td>
                    <td style={styles.td}>{student.phone_number}</td>
                    <td style={styles.td}>{student.school_email}</td>
                    <td style={styles.td}>{student.personal_email}</td>
                    <td style={styles.td}>{student.parent_name}</td>
                    <td style={styles.td}>{student.parent_mobile}</td>
                    <td style={styles.td}>{student.mentor_name}</td>
                    <td style={styles.td}>{student.mentor_staff_id}</td>
                    <td style={styles.td}>{student.mentor_email}</td>
                    {canEdit && (
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(student)}
                          style={{ ...styles.iconButton, color: '#667eea' }}
                          title="Edit"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          style={{ ...styles.iconButton, color: '#ef4444' }}
                          title="Delete"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            
            {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
            
            <div style={styles.formGrid}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} placeholder="Enter full name" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Roll Number *</label>
                <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} style={styles.input} placeholder="e.g., CS2024001" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Department *</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} style={styles.select}>
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Year *</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} style={styles.select}>
                  <option value="">Select Year</option>
                  {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Date of Birth *</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={styles.input} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Gender *</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.select}>
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Phone Number *</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} placeholder="10 digits" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>School Email *</label>
                <input type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} style={styles.input} placeholder="student@school.edu" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Personal Email *</label>
                <input type="email" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} style={styles.input} placeholder="personal@email.com" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Parent Name *</label>
                <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} style={styles.input} placeholder="Parent/Guardian name" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Parent Mobile *</label>
                <input type="tel" value={parentMobile} onChange={(e) => setParentMobile(e.target.value)} style={styles.input} placeholder="10 digits" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Mentor Name *</label>
                <input type="text" value={mentorName} onChange={(e) => setMentorName(e.target.value)} style={styles.input} placeholder="Faculty mentor name" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Mentor Staff ID *</label>
                <input type="text" value={mentorStaffId} onChange={(e) => setMentorStaffId(e.target.value)} style={styles.input} placeholder="e.g., STAFF001" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Mentor Email *</label>
                <input type="email" value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} style={styles.input} placeholder="mentor@school.edu" />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={closeModal} style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleSaveStudent} style={{ ...styles.button, ...styles.buttonPrimary, flex: 1 }} disabled={loading}>
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}