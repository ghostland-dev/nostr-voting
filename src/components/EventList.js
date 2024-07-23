import React, { useEffect } from 'react';
import useNostr from '../hooks/useNostr';

function EventList({ isAuthenticated }) {
  const { events, fetchEvents, voteOnEvent } = useNostr(isAuthenticated);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleVote = (eventId, candidate) => {
    voteOnEvent(eventId, candidate);
  };

  return (
    <div>
      <h2>Available Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>Start Date: {new Date(event.startDate * 1000).toLocaleString()}</p>
          <p>End Date: {new Date(event.endDate * 1000).toLocaleString()}</p>
          <h4>Candidates:</h4>
          {event.candidates.map((candidate, index) => (
            <div key={index}>
              <p>{candidate.name} {candidate.surname}</p>
              <button onClick={() => handleVote(event.id, candidate.publicKey)}>Vote</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default EventList;
