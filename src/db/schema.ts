import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role').default('user').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    subscriptionStatus: text('subscription_status').default('free'), // 'free' | 'active' | 'past_due' | 'canceled'
    planType: text('plan_type'), // 'monthly' | 'yearly'
    subscriptionEndDate: timestamp('subscription_end_date'),
    monthlyStoryCount: integer('monthly_story_count').default(0).notNull(),
    lastStoryReset: timestamp('last_story_reset').defaultNow(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const children = pgTable('children', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    age: text('age').notNull(),
    gender: text('gender').notNull().default('Boy'),
    color: text('color').default('blue'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stories = pgTable('stories', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    childId: uuid('child_id').references(() => children.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    imageUrl: text('image_url'),
    audioUrl: text('audio_url'),
    theme: text('theme'),
    duration: text('duration'),
    createdAt: timestamp('created_at').defaultNow().notNull(),

});

export const guest_generations = pgTable('guest_generations', {
    id: uuid('id').defaultRandom().primaryKey(),
    ipAddress: text('ip_address').notNull().unique(),
    generationCount: integer('generation_count').default(0).notNull(),
    lastGeneratedAt: timestamp('last_generated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
