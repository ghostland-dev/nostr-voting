import React, { useState } from 'react';
import useNostr from '../hooks/useNostr';

function CreateEvent({ isAuthenticated }) {
  const [candidates, setCandidates] = useState([{ name: '', surname: '' }]);
  const { createEvent } = useNostr(isAuthenticated);

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', surname: '' }]);
  };

  const handleChange = (index, event) => {
    const values = [...candidates];
    values[index][event.target.name] = event.target.value;
    setCandidates(values);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const eventDetails = {
      name: event.target.eventName.value,
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      candidates: candidates,
    };
    createEvent(eventDetails);
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input type="text" name="eventName" required />
        </label>
        <label>
          Start Date:
          <input type="datetime-local" name="startDate" required />
        </label>
        <label>
          End Date:
          <input type="datetime-local" name="endDate" required />
        </label>
        <div>
          <h3>Candidates</h3>
          {candidates.map((candidate, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={candidate.name}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={candidate.surname}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addCandidate}>
            Add Candidate
          </button>
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
