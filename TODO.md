# TODO: Fix Errors in Registration and Dashboard Code

## Tasks
- [x] Fix createUserWithEmailAndPassword call in Admin/inscrip-user.js to include password parameter
- [x] Ensure consistent Firestore collection name "utilisateurs" in Admin/inscrip-user.js
- [x] Fix inconsistent field IDs in forms ("adress" vs "adresse") in Admin/utilisat-dash.html
- [x] Normalize user status strings to consistent casing in Admin/utilisat-dash.html
- [x] Fix event listener selectors in dashboard code to match generated buttons in Admin/utilisat-dash.html
- [x] Use updateDoc instead of setDoc for partial updates in dashboard in Admin/utilisat-dash.html
- [x] Add password input and validation in registration form if missing in Admin/utilisat-dash.html

## Followup Steps
- [ ] Test registration functionality
- [ ] Test dashboard user display and actions
- [ ] Check console for runtime errors
- [ ] Verify user status toggling works correctly
