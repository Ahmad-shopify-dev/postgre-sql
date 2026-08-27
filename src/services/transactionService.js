
// THIS IS JUST AN EXAMPLE TO UNDERSTAND THE TRANSACTION PROCESS
// IT IS NOT RELATED TO OUR CURRENT SCHEMA PROCESS


// SEQUENTIAL SIMPLE TRANSACTION
const [updatedUser, deletedPost] = await prisma.$transaction([
  prisma.user.update({ where: { id: 1 }, data: { isActive: false } }),
  prisma.post.delete({ where: { id: 10 } })
]);


// INTERACTIVE TRANSATION
// Real-world Example: Money Transfer / Balance Deduction
const result = await prisma.$transaction(async (tx) => {
  // Step 1: Check user A balance and decrease it
  const sender = await tx.user.update({
    where: { id: senderId },
    data: { balance: { decrement: 500 } }
  });

  // Step 2: Safety check
  if (sender.balance < 0) {
    // throw error if balance becomes less than 0
    throw new Error("Insufficient funds!");
  }

  // Step 3: Increase user B balance
  const receiver = await tx.user.update({
    where: { id: receiverId },
    data: { balance: { increment: 500 } }
  });

  return { sender, receiver };
});