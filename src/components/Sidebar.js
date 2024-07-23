import { AiOutlineDashboard, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { BsBarChart, BsGraphUp } from 'react-icons/bs';

const Sidebar = ({ toggleDarkMode, logout }) => (
  <div className="w-1/4 bg-blue-700 dark:bg-indigo-900 text-white min-h-screen p-4">
    <h2 className="text-2xl font-bold mb-4">NostrVote Admin Dashboard</h2>
    <ul>
      <li className="mb-4">
        <AiOutlineDashboard className="inline-block mr-2" /> Dashboard
      </li>
      <li className="mb-4">
        <BsBarChart className="inline-block mr-2" /> Create Voting Post
      </li>
      <li className="mb-4">
        <BsGraphUp className="inline-block mr-2" /> View Voting Results
      </li>
      <li className="mb-4">
        <AiOutlineUser className="inline-block mr-2" /> Manage User Accounts
      </li>
    </ul>
    <button onClick={toggleDarkMode} className="bg-emerald-500 text-white p-2 rounded mt-4 w-full">
      Toggle Dark Mode
    </button>
    <button onClick={logout} className="bg-red-500 text-white p-2 rounded mt-4 w-full">
      <AiOutlineLogout className="inline-block mr-2" /> Logout
    </button>
  </div>
);

export default Sidebar;
