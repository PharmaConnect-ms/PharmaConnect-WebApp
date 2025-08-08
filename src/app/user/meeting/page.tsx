/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const JoinMeetingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const meetingId = searchParams.get('id');
  const meetingIDasString = meetingId ? meetingId.toString() : '';
  const usernameParam = searchParams.get('name');
  const [username, setUsername] = useState(usernameParam || '');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/meetings/getToken/${meetingIDasString}/${username}`);
      if (!res.ok) throw new Error('Failed to fetch meeting token');

      const token = await res.text(); // or res.json() if returned as JSON

      router.push(`/user/meeting/meetingRoom?user=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`);

    } catch (err) {
      alert('Could not join meeting: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Join Meeting</h1>

        <label className="block mb-2 text-sm font-medium">Your Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-xl p-3 mb-4"
        />

        <button
          onClick={handleJoin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-medium transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Joining...' : 'Enter Meeting'}
        </button>
      </div>
    </div>
  );
};

export default JoinMeetingPage;
