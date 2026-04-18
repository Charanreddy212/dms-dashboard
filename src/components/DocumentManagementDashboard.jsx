import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const mockDocuments = [
  { id: 1, code: 'QA-SOP-2024-001', title: 'Assembly Standard Operating Procedure', version: 'v2.3', status: 'Approved', department: 'Quality Assurance', owner: 'John Doe', expiry: '2025-01-01', daysToExpiry: 267 },
  { id: 2, code: 'PROD-WI-2024-015', title: 'Welding Work Instruction', version: 'v1.0', status: 'Under Review', department: 'Production', owner: 'Mike Johnson', expiry: '2024-12-15', daysToExpiry: 241 },
  { id: 3, code: 'HR-POL-2024-003', title: 'Leave Policy', version: 'v3.0', status: 'Approved', department: 'HR', owner: 'Sarah Lee', expiry: '2025-06-30', daysToExpiry: 448 },
  { id: 4, code: 'EHS-FORM-2024-008', title: 'Incident Report Form', version: 'v2.1', status: 'Expired', department: 'EHS', owner: 'David Chen', expiry: '2024-03-15', daysToExpiry: -34 },
  { id: 5, code: 'QA-SOP-2024-002', title: 'Inspection Procedure', version: 'v1.5', status: 'Approved', department: 'Quality Assurance', owner: 'Mary Smith', expiry: '2024-12-01', daysToExpiry: 227 },
];

const mockApprovals = [
  { id: 1, docCode: 'QA-SOP-2024-001', title: 'Assembly SOP v2.3', step: 'Technical Review', dueDate: '2024-04-16', overdue: true, priority: 'High' },
  { id: 2, docCode: 'PROD-WI-2024-015', title: 'Welding Procedure v1.0', step: 'Safety Review', dueDate: '2024-04-15', overdue: true, priority: 'Critical' },
  { id: 3, docCode: 'HR-POL-2024-003', title: 'Leave Policy v3.0', step: 'Legal Review', dueDate: '2024-04-20', overdue: false, priority: 'Medium' },
];

const mockActivity = [
  { id: 1, action: 'QA-SOP-2024-001 approved by Jane Smith', time: '2 hours ago', type: 'approval' },
  { id: 2, action: 'PROD-WI-2024-015 uploaded by Mike Johnson', time: '4 hours ago', type: 'upload' },
  { id: 3, action: 'HR-POL-2024-003 requires your review', time: '6 hours ago', type: 'review' },
  { id: 4, action: 'EHS-FORM-2024-008 has expired', time: '1 day ago', type: 'expired' },
];

const DocumentManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'var(--accent-green)',
      'Under Review': 'var(--accent-yellow)',
      'Draft': 'var(--accent-blue)',
      'Expired': 'var(--accent-red)',
      'Obsolete': 'var(--text-muted)'
    };
    return colors[status] || 'var(--text-muted)';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'var(--accent-red)',
      'High': 'var(--accent-orange)',
      'Medium': 'var(--accent-yellow)',
      'Low': 'var(--accent-blue)'
    };
    return colors[priority] || 'var(--text-muted)';
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || doc.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const stats = {
    totalDocs: mockDocuments.length,
    pendingApprovals: mockApprovals.length,
    expiredDocs: mockDocuments.filter(d => d.status === 'Expired').length,
    expiringSoon: mockDocuments.filter(d => d.daysToExpiry > 0 && d.daysToExpiry <= 30).length,
    complianceScore: 92
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Welcome Header */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome back, John Doe</h1>
          <p className="subtitle">Quality Assurance Department • {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="live-clock">
          <div className="clock-time">{time.toLocaleTimeString('en-US', { hour12: false })}</div>
          <div className="clock-label">System Time</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{'--card-color': 'var(--accent-blue)'}}>
          <div className="kpi-icon">📄</div>
          <div className="kpi-content">
            <div className="kpi-value">{stats.totalDocs}</div>
            <div className="kpi-label">Total Documents</div>
            <div className="kpi-change positive">+34 this month</div>
          </div>
        </div>

        <div className="kpi-card" style={{'--card-color': 'var(--accent-yellow)'}}>
          <div className="kpi-icon">⏳</div>
          <div className="kpi-content">
            <div className="kpi-value">{stats.pendingApprovals}</div>
            <div className="kpi-label">Pending Approvals</div>
            <div className="kpi-change negative">Needs attention</div>
          </div>
        </div>

        <div className="kpi-card" style={{'--card-color': 'var(--accent-red)'}}>
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-content">
            <div className="kpi-value">{stats.expiredDocs}</div>
            <div className="kpi-label">Expired Documents</div>
            <div className="kpi-change">Action required</div>
          </div>
        </div>

        <div className="kpi-card" style={{'--card-color': 'var(--accent-green)'}}>
          <div className="kpi-icon">✓</div>
          <div className="kpi-content">
            <div className="kpi-value">{stats.complianceScore}%</div>
            <div className="kpi-label">Compliance Score</div>
            <div className="kpi-change positive">+3% MoM</div>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="activity-list">
            {mockActivity.map(item => (
              <div key={item.id} className={`activity-item activity-${item.type}`}>
                <div className="activity-icon">
                  {item.type === 'approval' && '✓'}
                  {item.type === 'upload' && '↑'}
                  {item.type === 'review' && '👁'}
                  {item.type === 'expired' && '⚠'}
                </div>
                <div className="activity-content">
                  <div className="activity-text">{item.action}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="approvals-section">
          <div className="section-header">
            <h2>Pending Approvals</h2>
            <span className="count-badge">{mockApprovals.length}</span>
          </div>
          <div className="approvals-list">
            {mockApprovals.map(approval => (
              <div key={approval.id} className="approval-card">
                <div className="approval-header">
                  <span className={`priority-badge priority-${approval.priority.toLowerCase()}`}
                        style={{backgroundColor: getPriorityColor(approval.priority)}}>
                    {approval.priority}
                  </span>
                  {approval.overdue && <span className="overdue-badge">Overdue</span>}
                </div>
                <div className="approval-code">{approval.docCode}</div>
                <div className="approval-title">{approval.title}</div>
                <div className="approval-meta">
                  <span>Step: {approval.step}</span>
                  <span>Due: {approval.dueDate}</span>
                </div>
                <div className="approval-actions">
                  <button className="btn-approve">✓ Approve</button>
                  <button className="btn-reject">✗ Reject</button>
                  <button className="btn-view">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn action-upload">
          <span className="action-icon">⬆</span>
          <span className="action-label">Upload Document</span>
        </button>
        <button className="action-btn action-create">
          <span className="action-icon">+</span>
          <span className="action-label">Create SOP</span>
        </button>
        <button className="action-btn action-search">
          <span className="action-icon">🔍</span>
          <span className="action-label">AI Search</span>
        </button>
        <button className="action-btn action-report">
          <span className="action-icon">📊</span>
          <span className="action-label">Generate Report</span>
        </button>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="documents-content">
      <div className="documents-header">
        <h1>Document Repository</h1>
        <button className="btn-primary">+ Upload New Document</button>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search documents by title, code, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="Quality Assurance">Quality Assurance</option>
          <option value="Production">Production</option>
          <option value="HR">HR</option>
          <option value="EHS">EHS</option>
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Under Review">Under Review</option>
          <option value="Draft">Draft</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="documents-table-wrapper">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Version</th>
              <th>Status</th>
              <th>Department</th>
              <th>Owner</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map(doc => (
              <tr key={doc.id} className="document-row">
                <td className="doc-code">{doc.code}</td>
                <td className="doc-title">{doc.title}</td>
                <td className="doc-version">{doc.version}</td>
                <td>
                  <span className="status-badge" style={{backgroundColor: getStatusColor(doc.status)}}>
                    {doc.status}
                  </span>
                </td>
                <td>{doc.department}</td>
                <td>{doc.owner}</td>
                <td className={doc.daysToExpiry < 0 ? 'expired' : doc.daysToExpiry <= 30 ? 'expiring-soon' : ''}>
                  {doc.expiry}
                  {doc.daysToExpiry > 0 && doc.daysToExpiry <= 30 && (
                    <span className="days-label"> ({doc.daysToExpiry}d)</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button className="icon-btn" title="View">👁</button>
                  <button className="icon-btn" title="Download">⬇</button>
                  <button className="icon-btn" title="More">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div>Showing {filteredDocuments.length} of {mockDocuments.length} documents</div>
        <div className="pagination">
          <button className="page-btn">←</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">→</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dms-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">📁</span>
            <span className="logo-text">DMS Enterprise</span>
          </div>
        </div>

        <div className="nav-center">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button className="nav-btn">Approvals</button>
          <button className="nav-btn">Analytics</button>
          <button className="nav-btn">Admin</button>
        </div>

        <div className="nav-right">
          <div className="search-mini">
            <input type="text" placeholder="Quick search..." />
          </div>
          <button className="icon-btn-nav" onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            <span className="notification-badge">3</span>
          </button>
          <div className="user-menu">
            <div className="user-avatar">JD</div>
            <span className="user-name">John Doe</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'documents' && renderDocuments()}
      </main>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="mark-read-btn">Mark all read</button>
          </div>
          <div className="notifications-list">
            <div className="notification-item unread">
              <div className="notif-icon">⏰</div>
              <div className="notif-content">
                <div className="notif-title">Approval Required</div>
                <div className="notif-text">QA-SOP-2024-001 needs your review</div>
                <div className="notif-time">2 hours ago</div>
              </div>
            </div>
            <div className="notification-item unread">
              <div className="notif-icon">⚠️</div>
              <div className="notif-content">
                <div className="notif-title">Document Expiring</div>
                <div className="notif-text">EHS-FORM-2024-008 expires in 7 days</div>
                <div className="notif-time">5 hours ago</div>
              </div>
            </div>
            <div className="notification-item">
              <div className="notif-icon">✓</div>
              <div className="notif-content">
                <div className="notif-title">Approval Completed</div>
                <div className="notif-text">Your review was accepted</div>
                <div className="notif-time">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default DocumentManagementDashboard;
