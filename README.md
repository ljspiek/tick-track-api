<h1>TickTrack (Server)</h1>
***************************

<h2>Links</h2>
***************************
<p>Live Client hosted on Vercel (formerly Zeit): https://tick-track-app.now.sh/</p>
<p>TickTrack App (Client) Repo: https://github.com/ljspiek/tick-track-app </p>


<h2>Summary</h2>
***************************
<p>This is the server for the TickTrack app. </p>

<p> /api/login - POST authenticated login</p>
<p> /api/users - POST create new user</p>
<p> /api/fields - GET fields to create forms</p>
<p> /api/log - GET logs or POST a log</p>
<p> /api/log/:log_id - GET, DELETE or PATCH a specific log by log_id</p>

<h2>Installation</h2>
***************************
<p>To get started run 'npm install' to install all required dependencies.</p>

<h2>Technology Used</h2>
***************************
<ul>This server uses the following technology:
    <li>Node.js</li>
    <li>Express.js</li>
    <li>PostgreSQL</li>
    <li>Knex.js</li>
    <li>JSON Web Token(JWT)</li>
    <li>Treeize</li>
</ul>

<h2>Screenshots</h2>
***************************
<img src = home.png>
<img src = log.png>
<img src = history.png>
<img src = detail.png>
