const cron = require('node-cron');
const Driver = require('../models/Driver');
const { sendLicenseExpiryReminder } = require('./emailService');

/**
 * Check all drivers for expiring licenses.
 * Sends reminder email if expiry is within 30 days.
 * Marks drivers as suspended if already expired.
 */
const checkDriverLicenseExpiry = async () => {
  try {
    console.log('🕐 [CRON] Running license expiry check...');

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find drivers with licenses expiring within 30 days or already expired
    const expiringDrivers = await Driver.find({
      licenseExpiry: { $lte: in30Days },
      status: { $ne: 'Suspended' },
    });

    let remindersCount = 0;
    let suspendedCount = 0;

    for (const driver of expiringDrivers) {
      const daysLeft = Math.ceil((driver.licenseExpiry - now) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 0) {
        // License expired — suspend driver if still Available
        if (driver.status === 'Available') {
          driver.status = 'Suspended';
          await driver.save();
          suspendedCount++;
          console.log(`🚫 Driver ${driver.name} suspended – license expired.`);
        }
      } else {
        // Send reminder if not already sent or if < 7 days left
        if (!driver.licenseExpiryReminderSent || daysLeft <= 7) {
          await sendLicenseExpiryReminder(driver, daysLeft);
          driver.licenseExpiryReminderSent = true;
          await driver.save();
          remindersCount++;
          console.log(`📧 Reminder sent to ${driver.name} – ${daysLeft} days left.`);
        }
      }
    }

    console.log(`✅ [CRON] License check done: ${remindersCount} reminders, ${suspendedCount} suspended.`);
  } catch (err) {
    console.error('[CRON] License expiry check error:', err.message);
  }
};

/**
 * Initialize all cron jobs.
 * Called once at server startup.
 */
const initCronJobs = () => {
  // Daily at 08:00 AM — license expiry check
  cron.schedule('0 8 * * *', checkDriverLicenseExpiry, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  });

  console.log('⏰ Cron jobs initialized: license expiry check @ 08:00 daily.');
};

module.exports = { initCronJobs, checkDriverLicenseExpiry };
