# 🧪 Testing Guide - Data Persistence Fix

## How to Test the Fix

### Test 1: New User Sign Up
1. Open the application at `http://localhost:8080`
2. Click "Sign up for free"
3. You should see a welcome message with your new username (e.g., "Coder1234")
4. Solve a problem to gain XP and streak
5. Check your Profile page - you should see your XP and streak
6. **Note your XP and streak values**

### Test 2: Data Persists After Logout/Login
1. Logout (if there's a logout button) OR clear the auth token:
   - Open DevTools (F12)
   - Go to Application > Local Storage
   - Delete `hackathon-habit-auth` key
   - Refresh the page
2. You should be redirected to the login page
3. Login with the same email you used before
4. **Verify**: Your XP, streak, and problems solved are EXACTLY as you left them!
5. ✅ **Success if data is preserved!**

### Test 3: Solving More Problems
1. While logged in, solve another problem
2. Check that XP increases
3. Check that problems solved increases
4. Logout and login again
5. **Verify**: All new progress is still there!

### Test 4: Multiple Users
1. Create User A (sign up for free)
2. Solve 2 problems as User A
3. Logout
4. Create User B (sign up for free)
5. Solve 1 problem as User B
6. Logout
7. Login as User A again
8. **Verify**: User A still has 2 problems solved
9. Logout
10. Login as User B again
11. **Verify**: User B still has 1 problem solved

## Quick DevTools Check

### Before Fix (OLD BEHAVIOR):
```javascript
// In DevTools Console:
JSON.parse(localStorage.getItem('hackathon-habit-user'))
// Output: { id: "...", email: "...", xp: 0 }  ❌ No problemsSolved, streak, etc.
```

### After Fix (NEW BEHAVIOR):
```javascript
// In DevTools Console:
JSON.parse(localStorage.getItem('hackathon-habit-user'))
// Output: { 
//   id: "...", 
//   email: "...", 
//   xp: 150,                    ✅
//   problemsSolved: 2,          ✅
//   streak: 1,                  ✅
//   level: "beginner",          ✅
//   history: [...],             ✅
//   lastVisit: "..."            ✅
// }
```

## Expected Toast Messages

### On First Login (New User):
```
✅ "Welcome!"
   "Let's build that coding habit!"
```

### On Returning Login (Existing User):
```
✅ "Welcome back!"
   "You have 150 XP and 1 day streak!"
```

## Common Issues to Check

### Issue: Data still resets
**Solution**: 
1. Clear all localStorage data
2. Refresh the page
3. Sign up as a new user
4. The fix should work for new users immediately

### Issue: Old users don't see their data
**Explanation**: 
- Old users (before the fix) had their data in separate localStorage keys
- On first login after the fix, the system will migrate their data to the user object
- If data was already lost, it cannot be recovered (start fresh)

### Issue: Leaderboard not updating
**Solution**:
- The fix updates both `hackathon-habit-user` and `hackathon-habit-all-users`
- Leaderboard should reflect current XP
- If not, check DevTools to see if `hackathon-habit-all-users` contains updated user objects

## Success Criteria

✅ New users start with 0 XP, 0 streak, 0 problems solved
✅ Solving problems increases all stats
✅ Logging out and back in preserves ALL data
✅ Multiple users can have separate progress
✅ Leaderboard shows correct XP for all users
✅ Profile page shows correct stats
✅ Welcome back message shows correct XP and streak

---

**If all tests pass, the data persistence issue is FIXED!** 🎉
