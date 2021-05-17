https://community-movie-awards.netlify.app/ <br /><br />
### Feature List: 
1. Sign in Authentication, creates user and generates uid to save user data (firebase auth)
2. Movie search, as user types triggers calls (useEffect, useState). Throttles calls using setTimer (so does not make 17 calls for 17 letters typed etc.)
3. Determine if need to disable button by checking nominations in the database (see below for more on database)
4. Add nomination button adds to both all nominations and user specific nomination if logged in (see below for more on database)
5. If use log in, search database to load in their past nominations on log in
6. When at 5 nominations display pop up (using react portal) and disable search bar
7. Able to remove user's nominations (updates to both all nomination and user's nomination documents in database)
8. View all nominations, sorted by number of votes
9. Vote on all nominations (update to database) 
10. Disable vote after submit a vote (keeps track of all voters uid, and uses state to track not logged in user)
11. Disable vote if is the user that nominated it <br /><br />
--- 
### Database
- Uses firestore to store data
- One data base has documents for each user, in each document stores uid and an array of user's move nomination (movie objects)
- Second data base has documents for each nomination; include all movie data, number of votes, an array of voters, and person who made the nomination <br /><br />

### Tools:
- React.js
- Styled Components (CSS-in-JS)
- Firebase Auth
- Firestore
- Axios (for fetch)
- react-icons
- react-firebase-hooks
