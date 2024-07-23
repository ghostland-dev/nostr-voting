import { useState } from 'react';

const AdminPanel = ({ generatePrivateKeys, generatedKeys }) => {
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = () => {
    // Logic to create a post
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6">
      <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Voting Post</h2>
        <input
          type="text"
          placeholder="Post Title"
          className="border p-2 mb-4 w-full rounded dark:bg-gray-700 dark:text-white"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="border p-2 mb-4 w-full rounded dark:bg-gray-700 dark:text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button onClick={createPost} className="bg-blue-500 text-white p-2 rounded">Create Post</button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Voting Results</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Voting Title 1</h3>
            <p className="text-gray-800 dark:text-white">Description of the voting post 1...</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Voting Title 2</h3>
            <p className="text-gray-800 dark:text-white">Description of the voting post 2...</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Voting Title 3</h3>
            <p className="text-gray-800 dark:text-white">Description of the voting post 3...</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Manage User Accounts</h2>
        <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
          <ul className="list-disc pl-6">
            <li className="text-gray-800 dark:text-white">User Account 1 <button className="bg-blue-500 text-white p-1 rounded ml-2">Edit</button></li>
            <li className="text-gray-800 dark:text-white">User Account 2 <button className="bg-blue-500 text-white p-1 rounded ml-2">Edit</button></li>
            <li className="text-gray-800 dark:text-white">User Account 3 <button className="bg-blue-500 text-white p-1 rounded ml-2">Edit</button></li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md mt-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Generate Private Keys</h3>
          <button onClick={() => generatePrivateKeys(10)} className="bg-blue-500 text-white p-2 rounded">Generate 10 Private Keys</button>
          {generatedKeys.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-bold text-gray-800 dark:text-white">Generated Keys:</h4>
              <ul className="list-disc pl-6">
                {generatedKeys.map((key, index) => (
                  <li key={index} className="text-gray-800 dark:text-white">
                    Private Key: {key.privateKey}, Public Key: {key.publicKey}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
