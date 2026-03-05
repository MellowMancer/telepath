// Not used anywhere in the app, just wanted a quick script to wipe all rooms and dependent data from the database during development

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllRooms() {
  try {
    console.log('Starting deletion...');

    // Delete all messages
    const deletedMessages = await prisma.message.deleteMany({});
    console.log(`Deleted ${deletedMessages.count} messages`);

    // Delete all room memberships
    const deletedMembers = await prisma.roomMember.deleteMany({});
    console.log(`Deleted ${deletedMembers.count} room memberships`);

    // Delete all rooms
    const deletedRooms = await prisma.room.deleteMany({});
    console.log(`Deleted ${deletedRooms.count} rooms`);

    console.log('\nAll rooms and associated data have been deleted!');
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllRooms();
