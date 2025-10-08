// src/components/common/BackendDiagnostic.js
import React, { useState } from 'react';

const BackendDiagnostic = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [bypassEnabled, setBypassEnabled] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('REACT_APP_DEV_BYPASS_AUTH') === 'true';
    } catch (e) {
      return false;
    }
  });

  const runDiagnostics = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Backend Health Check
      console.log('Testing backend health...');
      const healthResponse = await fetch('http://localhost:5000/api/health');
      results.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: healthResponse.ok ? await healthResponse.json() : 'Failed'
      };
    } catch (error) {
      results.health = { error: error.message };
    }

    try {
      // Test 2: Registration Endpoint
      console.log('Testing registration endpoint...');
      const testUser = {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@test.com',
        password: 'testpass123',
        confirmPassword: 'testpass123'
      };
      
      const regResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      results.register = {
        status: regResponse.status,
        ok: regResponse.ok,
        data: await regResponse.json()
      };
    } catch (error) {
      results.register = { error: error.message };
    }

    try {
      // Test 3: Login Endpoint (with fake credentials to see error structure)
      console.log('Testing login endpoint...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'wrongpass' })
      });
      
      results.login = {
        status: loginResponse.status,
        ok: loginResponse.ok,
        data: await loginResponse.json()
      };
    } catch (error) {
      results.login = { error: error.message };
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Backend Diagnostic</h3>
      
      <button 
        onClick={runDiagnostics}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Run Diagnostics'}
      </button>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bypassEnabled}
            onChange={(e) => {
              const val = e.target.checked;
              setBypassEnabled(val);
              try {
                if (val) localStorage.setItem('REACT_APP_DEV_BYPASS_AUTH', 'true');
                else localStorage.removeItem('REACT_APP_DEV_BYPASS_AUTH');
              } catch (err) {
                console.error('Failed to set bypass flag in localStorage', err);
              }
            }}
          />
          Enable dev auth bypass (local only)
        </label>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2 text-xs">
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="border-b pb-2">
              <strong>{test}:</strong>
              <pre className="bg-gray-100 p-1 mt-1 rounded text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackendDiagnostic;