window.onload = function() {
  updateDisplay('All');
}

/**
 * Updates the page based on the selected leaderboard type
 * @param {string} selected 
 */
function updateDisplay(selected) {
  const leaderboardDisplay = getLeaderboardDisplay(selected);
  document.getElementById('leaderboard-table-body').innerHTML = leaderboardDisplay;

  setButtonStatuses(selected);
  setAllMessageStatus(selected);
}

/**
 * Gets the HTML for the leaderboard table body based on the selected type
 * @param {string} selected 
 * @returns {string}
 */
function getLeaderboardDisplay(selected) {
  const leaderboard = getLeaderboard(selected);

  if (leaderboard.length === 0) {
    return '<td><td><td><td>No results yet</td></td></td></td>';
  }

  let tiePosition = 1;
  const leaderboardDisplay = leaderboard.map((item, index) => {
    const position = index + 1;

    const nextTime = leaderboard[index + 1] ? leaderboard[index + 1].time : null;
    const previousTime = leaderboard[index - 1] ? leaderboard[index - 1].time : null;
    const tie = item.time === nextTime || item.time === previousTime;

    if (tie && item.time !== previousTime) {
      tiePosition = position;
    }

    return `<tr>
      <td>${tie ? `${tiePosition} (tie)` : position}</td>
      <td>${item.name}</td>
      <td>${item.time}</td>
      <td>${item.type}</td>
      <td>${item.location}</td>
      <td>${item.date}</td>
      <td>${item.link ? `<a href="${item.link}" target="_blank">Link</a>` : '-'}</td>
    </tr>`;
  });

  return leaderboardDisplay.join('');
}

/**
 * Gets the leaderboard sorted by time and filtered by type
 * @param {string} selected 
 * @returns {object[]}
 */
function getLeaderboard(selected) {
  const leaderboard = selected === 'All'
    ? getLeaderboardCopy()
    : getLeaderboardCopy().filter((item) => item.type === selected)

  return sortAndStripDuplicates(leaderboard);
}

/**
 * Sorts the leaderboard by time and removes duplicate names
 * @param {object[]} leaderboard 
 * @returns {object[]}
 */
function sortAndStripDuplicates(leaderboard) {
  const sortedLeaderboard = leaderboard.sort(sortByTime);
  const existingNames = {};

  return sortedLeaderboard.filter((item) => {
    if (existingNames[item.name]) {
      return false;
    } else {
      existingNames[item.name] = true;
      return true;
    }
  });
}

/**
 * Sets the visibility of the "All" message based on the selected type
 * @param {string} selected 
 */
function setAllMessageStatus(selected) {
  if (selected === 'All') {
    document.getElementById('all-message').classList.remove('hidden');
  } else {
    document.getElementById('all-message').classList.add('hidden');
  }
}

/**
 * Sets the disabled status of the leaderboard type buttons based on the selected type
 * @param {string} selected 
 */
function setButtonStatuses(selected) {
  Object.values(TYPES).forEach((type) => {
    const buttonType = `${type.toLowerCase().replace(' ', '-')}-button`;
    document.getElementById(buttonType).disabled = (selected === type);
  });
}

/**
 * Sort function using the 'time' field of an object
 * @param {object} a 
 * @param {object} b 
 * @returns {number}
 */
function sortByTime(a, b) {
  return toSeconds(a.time) - toSeconds(b.time);
}

/**
 * Converts a time string (mm:ss) to seconds
 * @param {string} timeString 
 * @returns {number}
 */
function toSeconds(timeString) {
  const values = timeString.split(':');
  return (parseInt(values[0], 10) * 60) + parseInt(values[1], 10);
}

/**
 * Gets a copy of the leaderboard
 * @returns {object[]}
 */
function getLeaderboardCopy () {
  return LEADERBOARD.slice();
}

const TYPES = {
  ALL: 'All',
  ROUGH_WATER: 'Rough Water',
  CALM_WATER: 'Calm Water',
  INDOOR: 'Indoor',
}

const LEADERBOARD = [
  {
    name: 'Jon Merrill',
    time: '34:09',
    type: TYPES.ROUGH_WATER,
    location: 'Moonstone Beach, CA, USA',
    date: '08/05/2023',
    link: 'https://www.strava.com/activities/9590443344',
  },
  {
    name: 'Tyler Lovio-Coley',
    time: '34:09',
    type: TYPES.ROUGH_WATER,
    location: 'Moonstone Beach, CA, USA',
    date: '08/05/2023',
    link: 'https://www.strava.com/activities/9590443344',
  },
];
