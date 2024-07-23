import ApexCharts from 'react-apexcharts';

const UserVoting = ({ userHasVoted, userVoteChoice, publishVote, getVotes, votes, totalVotes, voteData, chartOptions }) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-md">
    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Vote for President</h2>
    <div className="flex space-x-4 my-4">
      <button
        onClick={() => publishVote("candidateA")}
        className={`p-2 rounded ${userVoteChoice === "candidateA" ? "bg-green-700 text-white" : "bg-green-500 text-white"}`}
        disabled={userHasVoted}
      >
        Vote for Candidate A
      </button>
      <button
        onClick={() => publishVote("candidateB")}
        className={`p-2 rounded ${userVoteChoice === "candidateB" ? "bg-red-700 text-white" : "bg-red-500 text-white"}`}
        disabled={userHasVoted}
      >
        Vote for Candidate B
      </button>
    </div>
    {userHasVoted && <p className="mb-4 text-blue-500"><strong>You have already voted for {userVoteChoice}.</strong></p>}
    <button onClick={getVotes} className="bg-gray-500 text-white p-2 rounded">
      Load Votes
    </button>
    <div className="my-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Vote Counts:</h2>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-md">
        <p className="mb-2 text-gray-800 dark:text-white"><strong>Candidate A Votes:</strong> {votes.candidateA}</p>
        <p className="mb-2 text-gray-800 dark:text-white"><strong>Candidate B Votes:</strong> {votes.candidateB}</p>
        <p className="text-gray-800 dark:text-white"><strong>Total Votes:</strong> {totalVotes}</p>
        {totalVotes > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Vote Statistics:</h3>
            <ApexCharts options={chartOptions} series={voteData.series} type="pie" width="380" />
            <p className="mt-4 text-gray-800 dark:text-white"><strong>Candidate A Percentage:</strong> {(votes.candidateA / totalVotes * 100).toFixed(2)}%</p>
            <p className="text-gray-800 dark:text-white"><strong>Candidate B Percentage:</strong> {(votes.candidateB / totalVotes * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default UserVoting;
