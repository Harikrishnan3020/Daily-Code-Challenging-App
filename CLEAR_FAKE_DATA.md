# Clear Fake Data from Leaderboard

If you're seeing fake/mock users on the leaderboard, run this script in your browser console **once** to clear them:

## Option 1: Browser Console (Recommended)

1. Open your app in the browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Paste and run this code:

```javascript
// Clear fake users and keep only real logged-in users
let allUsers = JSON.parse(localStorage.getItem("hackathon-habit-all-users") || "[]");
const filteredUsers = allUsers.filter(user => user.createdAt && user.id && user.email);
localStorage.setItem("hackathon-habit-all-users", JSON.stringify(filteredUsers));
console.log(`✅ Cleared ${allUsers.length - filteredUsers.length} fake users!`);
console.log(`📊 Real users remaining: ${filteredUsers.length}`);
location.reload();
```

## Option 2: Complete Reset

To start fresh with an empty leaderboard:

```javascript
localStorage.removeItem("hackathon-habit-all-users");
console.log("✅ Leaderboard cleared! Only new sign-ups will appear.");
location.reload();
```

## What This Does

- **Removes**: Any pre-seeded or fake user data
- **Keeps**: Only users who actually signed up via the Login page
- **How**: Filters users based on having valid `createdAt`, `id`, and `email` fields

## After Running

1. The leaderboard will show **only real users** who logged in
2. New users who sign up will automatically appear
3. Existing logged-in users with XP will remain visible

---

**Note**: The app has been updated to automatically filter fake users going forward. This script is only needed to clean up existing data.
