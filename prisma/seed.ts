import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marrakech.com' },
    update: {
      role: 'ADMIN',
      password: adminPassword,
      name: 'Admin User'
    },
    create: {
      email: 'admin@marrakech.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+212 600 000 000'
    }
  })
  console.log('✅ Created Admin user:', admin.email)

  // Create Customer Users
  const customer1Password = await bcrypt.hash('customer123', 10)
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: { role: 'CUSTOMER', password: customer1Password },
    create: {
      email: 'customer1@example.com',
      password: customer1Password,
      name: 'John Doe',
      role: 'CUSTOMER',
      phone: '+212 600 000 002'
    }
  })
  console.log('✅ Created Customer 1:', customer1.email)

  const customer2Password = await bcrypt.hash('customer123', 10)
  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: { role: 'CUSTOMER', password: customer2Password },
    create: {
      email: 'customer2@example.com',
      password: customer2Password,
      name: 'Jane Smith',
      role: 'CUSTOMER',
      phone: '+212 600 000 003'
    }
  })
  console.log('✅ Created Customer 2:', customer2.email)

  // Seed Experiences
  let experiences: any[] = [];
  try {
    const experiencesRaw = fs.readFileSync(path.join(process.cwd(), 'prisma', 'experiences-final.json'), 'utf-8')
    experiences = JSON.parse(experiencesRaw)
  } catch (error) {
    console.warn('⚠️ Could not load experiences-final.json. Seeding skipped for experiences.')
    console.error(error)
  }

  if (experiences.length > 0) {
    console.log(`🌱 Seeding ${experiences.length} experiences...`)

    for (const exp of experiences) {
      try {
        await prisma.experience.upsert({
          where: { slug: exp.slug },
          update: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...exp as any,
            faqs: exp.faqs,
            itinerary: exp.itinerary,
            importantInfo: exp.importantInfo,
            imageConcepts: exp.imageConcepts,
            relatedExperiences: exp.relatedExperiences,
          },
          create: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...exp as any,
            slug: exp.slug,
            faqs: exp.faqs,
            itinerary: exp.itinerary,
            importantInfo: exp.importantInfo,
            imageConcepts: exp.imageConcepts,
            relatedExperiences: exp.relatedExperiences,
            popularity: Math.floor(Math.random() * 100),
            featured: Math.random() > 0.8
          }
        })
      } catch (error) {
        console.error(`⚠️ Failed to seed experience: ${exp.title}`, error)
      }
    }
    console.log('✅ Experiences seeded successfully')
  }

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
