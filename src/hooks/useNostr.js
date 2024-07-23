import { useEffect, useState } from 'react';
import { relayInit, signEvent, getPublicKey, generatePrivateKey } from 'nostr-tools';

const useNostr = () => {
  const [relay, setRelay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      const connectRelay = async () => {
        setLoading(true);
        const relay = relayInit('wss://relay.damus.io');
        await relay.connect();

        relay.on('connect', async () => {
          setRelay(relay);
          setLoading(false);
        });
        relay.on('error', () => {
          console.log('failed to connect');
          setLoading(false);
        });
      };

      connectRelay();
    }
  }, [user]);

  const createEvent = async (eventDetails) => {
    if (!relay || !user) return;
    const event = {
      ...eventDetails,
      pubkey: getPublicKey(user.privateKey),
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [],
      content: JSON.stringify(eventDetails.candidates),
    };
    event.id = signEvent(event, user.privateKey);
    await relay.publish(event);
    setEvents([...events, event]);
  };

  const fetchEvents = async () => {
    if (!relay) return;
    const fetchedEvents = await relay.query({ kinds: [1] });
    setEvents(fetchedEvents);
  };

  const voteOnEvent = async (eventId, candidate) => {
    if (!relay || !user) return;
    const vote = {
      pubkey: getPublicKey(user.privateKey),
      created_at: Math.floor(Date.now() / 1000),
      kind: 2,
      tags: [['e', eventId], ['p', candidate]],
      content: '',
    };
    vote.id = signEvent(vote, user.privateKey);
    await relay.publish(vote);
  };

  const loginUser = (privateKey) => {
    try {
      const publicKey = getPublicKey(privateKey);
      const user = { privateKey, publicKey };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      alert('Invalid private key');
    }
  };

  return { relay, loading, events, createEvent, fetchEvents, voteOnEvent, loginUser, user };
};

export default useNostr;
