import { useState } from 'react';
import { PythonLoopGame } from './components/PythonLoopGame';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <PythonLoopGame />
    </div>
  );
}
