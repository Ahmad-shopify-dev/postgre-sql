// SOME TIMES WE NEED COMPLEX CALCULATIONS WHICH ARE NOT POSSIBLE WITH PRISMA CLIENT
// Use Cases:
// Complex Analytics & Aggregations (GROUP BY with complex HAVING logic).
// Heavy Performance Optimization.
// Database-specific features (e.g., PostgreSQL Full-Text Search, Geospatial Queries).


// 1. SELECT Raw Query ($queryRaw)
const result = await prisma.$queryRaw`
  SELECT "authorId", COUNT(*) as total_posts 
  FROM "Post" 
  WHERE published = true 
  GROUP BY "authorId"
  HAVING COUNT(*) > 5;
`;

// 2. INSERT / UPDATE / DELETE Raw Query ($executeRaw)
const rowsAffected = await prisma.$executeRaw`
  UPDATE "User" SET "isActive" = false WHERE "age" < 18;
`;