import { generatePrivateKey, getEventHash, getPublicKey, relayInit, signEvent } from "nostr-tools";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaCopy, FaEnvelopeOpenText } from 'react-icons/fa';
import Sidebar from "./components/Sidebar";
import UserVoting from "./components/UserVoting";
import AdminPanel from "./components/AdminPanel";
 

const ADMIN_PUBLIC_KEY = '1def1db5109e5bff45946798db3eff01e99b442c2493e05115ec6bc36587ad8a';  

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span className="visually-hidden"><FaEnvelopeOpenText/></span>
      </div>
    </div>
  );
}

function App() {
  const [sk, setSk] = useState("");
  const [pk, setPk] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [relay, setRelay] = useState(null);
  const [pubStatus, setPubStatus] = useState("");
  const [votes, setVotes] = useState({ candidateA: 0, candidateB: 0 });
  const [totalVotes, setTotalVotes] = useState(0);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVoteChoice, setUserVoteChoice] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]); // For storing generated private keys
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const connectRelay = async () => {
        setLoading(true);
        const relay = relayInit("wss://relay.damus.io");
        await relay.connect();

        relay.on("connect", async () => {
          setRelay(relay);
          await getVotes(relay);
          setLoading(false);
        });
        relay.on("error", () => {
          console.log("failed to connect");
          setLoading(false);
        });
      };

      connectRelay();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    const privateKey = privateKeyInput.trim();
    if (privateKey) {
      const publicKey = getPublicKey(privateKey);
      setSk(privateKey);
      setPk(publicKey);
      setIsAuthenticated(true);
      if (publicKey === ADMIN_PUBLIC_KEY) {
        setIsAdmin(true);
      }
    }
  };

  const handleSignup = () => {
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);
    setSk(privateKey);
    setPk(publicKey);
    setPseudo(pseudoInput);
    setIsAuthenticated(true);
    if (publicKey === ADMIN_PUBLIC_KEY) {
      setIsAdmin(true);
    }
  };

  const createVoteEvent = (option) => {
    const event = {
      kind: 1,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["pseudo", pseudo]],
      content: `Vote: ${option}`,
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);

    return event;
  };

  const publishVote = (option) => {
    if (!relay || userHasVoted) return;

    const event = createVoteEvent(option);
    const pub = relay.publish(event);

    setLoading(true);
    pub.on("ok", () => {
      setPubStatus("Vote published");
      setUserHasVoted(true);
      setUserVoteChoice(option);
      setVotes((prevVotes) => ({
        ...prevVotes,
        [option]: prevVotes[option] + 1,
      }));
      setTotalVotes((prevTotal) => prevTotal + 1);
      setLoading(false);
      toast.success("Vote successfully published!", {
        icon: <FaCheckCircle />,
      });
    });
    pub.on("failed", (reason) => {
      setPubStatus(`Failed to publish vote: ${reason}`);
      setLoading(false);
      toast.error(`Failed to publish vote: ${reason}`, {
        icon: <FaTimesCircle />,
      });
    });
  };

  const getVotes = async (relay) => {
    if (!relay) return;

    setLoading(true);
    const events = await relay.list([{ kinds: [1] }]);
    const voteCounts = { candidateA: 0, candidateB: 0 };
    let userVote = false;
    let userVoteOption = "";

    events.forEach((event) => {
      if (event.content === "Vote: candidateA") voteCounts.candidateA++;
      if (event.content === "Vote: candidateB") voteCounts.candidateB++;
      if (event.pubkey === pk) {
        userVote = true;
        userVoteOption = event.content.split(": ")[1];
      }
    });

    setVotes(voteCounts);
    setTotalVotes(voteCounts.candidateA + voteCounts.candidateB);
    setUserHasVoted(userVote);
    setUserVoteChoice(userVoteOption);
    setLoading(false);
  };

  const generatePrivateKeys = (count) => {
    const keys = [];
    for (let i = 0; i < count; i++) {
      const privateKey = generatePrivateKey();
      const publicKey = getPublicKey(privateKey);
      keys.push({ privateKey, publicKey });
    }
    setGeneratedKeys(keys);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      icon: <FaCopy />,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSk("");
    setPk("");
    setPseudo("");
    setIsAdmin(false);
    setUserHasVoted(false);
    setUserVoteChoice("");
    setGeneratedKeys([]);
  };

  const voteData = {
    series: [votes.candidateA, votes.candidateB],
    labels: ['Candidate A', 'Candidate B']
  };

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Candidate A', 'Candidate B'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`container-fluid mx-auto   ${isDarkMode ? 'dark' : ''}`}>
      <Toaster />
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-salt dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{isLogin ? "Login" : "Sign Up"} with your Nostr Private Key</h1>
          {isLogin ? (
            <>
              <input
                type="password"
                className="border p-2 mb-4 w-1/2 rounded dark:bg-gray-700 dark:text-white"
                value={privateKeyInput}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
                placeholder="Enter your private key"
              />
              <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
                Login
              </button>
              <p className="mt-4 text-gray-800 dark:text-white">
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-blue-500 underline">
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                className="border p-2 mb-4 w-1/2 rounded dark:bg-gray-700 dark:text-white"
                value={pseudoInput}
                onChange={(e) => setPseudoInput(e.target.value)}
                placeholder="Enter your pseudo"
              />
              <button onClick={handleSignup} className="bg-green-500 text-white p-2 rounded">
                Generate Private Key
              </button>
              <p className="mt-4 text-gray-800 dark:text-white">
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-blue-500 underline">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex">
          <Sidebar toggleDarkMode={toggleDarkMode} logout={logout} />
          <div className="w-3/4 p-6 bg-gray-100 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Account Details</h2>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-white">Pseudo:</label>
                <input type="text" value={pseudo} disabled className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-800 dark:text-white">Private Key:</label>
                <input
                  type={showPrivateKey ? "text" : "password"}
                  value={sk}
                  disabled
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="absolute right-2 top-2 text-gray-800 dark:text-white"
                >
                  {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  onClick={() => copyToClipboard(sk)}
                  className="absolute right-8 top-2 text-gray-800 dark:text-white"
                >
                  <FaCopy />
                </button>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-800 dark:text-white">Public Key:</label>
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={pk}
                  disabled
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-2 top-2 text-gray-800 dark:text-white"
                >
                  {showSecretKey ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  onClick={() => copyToClipboard(pk)}
                  className="absolute right-8 top-2 text-gray-800 dark:text-white"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            {isAdmin ? (
              <AdminPanel generatePrivateKeys={generatePrivateKeys} generatedKeys={generatedKeys} />
            ) : (
              <UserVoting
                userHasVoted={userHasVoted}
                userVoteChoice={userVoteChoice}
                publishVote={publishVote}
                getVotes={() => getVotes(relay)}
                votes={votes}
                totalVotes={totalVotes}
                voteData={voteData}
                chartOptions={chartOptions}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
