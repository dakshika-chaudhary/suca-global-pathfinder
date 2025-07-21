
'use client';

import React, { useEffect, useState } from 'react';

interface Node {
  name: string;
}

export default function ShortestPathForm() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
   
    fetch(`https://suca-global-pathfinder.onrender.com/nodes`)
      .then(res => res.json())
      .then(data => setNodes(data))
      .catch(() => setError('🚨 Failed to load node data.'));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    setError('');


    try {
      console.log('Submitting with:', { source, destination });

      const res = await fetch(`https://suca-global-pathfinder.onrender.com/shortestPath/shortest-path`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: source.trim().toLowerCase(),
          destination: destination.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.result || '❌ Failed to fetch path.');
      setResult(data.result);
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Unknown error occurred');
  }
}

    setLoading(false);
  };

  // Extract only the "PATH: ..." line and format it with emojis
  const formatPath = (raw: string) => {
    const match = raw.match(/PATH:\s*(.+)/i);
    if (!match) return null;
    return match[1].split('->').map(s => s.trim()).join(' ➡️ ');
  };

  const formatCost = (raw: string) => {
    const match = raw.match(/COST:\s*([0-9.]+)/i);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl p-8 sm:p-10 space-y-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 drop-shadow">
          🧭 Shortest Path Finder
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-lg font-medium text-gray-700">Source 📍</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Source --</option>
              {nodes.map((node, i) => (
                <option key={i} value={node.name}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Destination 🎯</label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Destination --</option>
              {nodes.map((node, i) => (
                <option key={i} value={node.name}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!source || !destination || loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold py-3 px-4 rounded-xl shadow hover:scale-105 transition-transform duration-200"
          >
            {loading ? 'Calculating Path...' : '🧮 Find Shortest Path'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded p-4">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-300 text-green-800 rounded p-4 space-y-2 animate-fade-in">
            <h2 className="text-lg font-semibold text-green-700">✅ Result</h2>
            <p>
              <strong>Path:</strong>{' '}
              <span className="font-mono text-blue-800">{formatPath(result)}</span>
            </p>
            <p>
              <strong>Total Cost:</strong>{' '}
              <span className="font-bold text-purple-800">💰 {formatCost(result)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
