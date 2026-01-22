const admin = require('firebase-admin');
const path = require('path');

// Service account key path
const serviceAccount = require('C:\\Users\\HP\\Downloads\\student-database-managem-a6378-firebase-adminsdk-fbsvc-25aa115706.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/**
 * Set admin custom claim for a user
 */
async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ Admin claim set for ${email} (UID: ${user.uid})`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting admin claim for ${email}:`, error.message);
    return false;
  }
}

/**
 * Set student custom claim for a user
 */
async function setStudentClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'student' });
    console.log(`✅ Student claim set for ${email} (UID: ${user.uid})`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting student claim for ${email}:`, error.message);
    return false;
  }
}

/**
 * List all users and their custom claims
 */
async function listAllUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    console.log('\n📋 Current Users and Roles:');
    console.log('─'.repeat(60));
    
    for (const user of listUsersResult.users) {
      const role = user.customClaims?.role || 'student';
      console.log(`Email: ${user.email}`);
      console.log(`UID: ${user.uid}`);
      console.log(`Role: ${role}`);
      console.log('─'.repeat(60));
    }
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

// Main execution
(async () => {
  console.log('🔧 Firebase Admin Claims Setup\n');

  // TODO: Replace with your actual admin email addresses
  const adminEmails = [
    'admin@gmail.com'
    // Add more admin emails here
  ];

  // Optional: Set specific users as students
  const studentEmails = [
    'student1@gmail.com'
    // Add more student emails here
  ];

  console.log('Setting admin claims...\n');
  for (const email of adminEmails) {
    await setAdminClaim(email);
  }

  if (studentEmails.length > 0) {
    console.log('\nSetting student claims...\n');
    for (const email of studentEmails) {
      await setStudentClaim(email);
    }
  }

  console.log('\n✅ All claims set!\n');

  // List all users to verify
  await listAllUsers();

  console.log('\n✨ Done! You can now use these credentials to login.');
  console.log('\n⚠️  Note: Users may need to logout and login again for role changes to take effect.');
  process.exit(0);
})();