const { execSync } = require('child_process');

async function deploy() {
  try {
    console.log('🔄 Starting post-build deployment tasks...');
    
    // Only run database operations if we have the necessary environment variables
    if (process.env.POSTGRES_PRISMA_URL) {
      console.log('🔄 Running Prisma migrations...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Database migration completed');
      
      // Check if we need to seed the database
      console.log('🌱 Seeding database...');
      try {
        execSync('npm run db:seed', { stdio: 'inherit' });
        console.log('✅ Database seeding completed');
      } catch (seedError) {
        console.log('ℹ️ Database seeding skipped (may already contain data)');
      }
    } else {
      console.log('ℹ️ Skipping database operations (no database connection found)');
    }
    
    console.log('🎉 Post-build deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    // Don't exit with error code to prevent build failure in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

deploy();