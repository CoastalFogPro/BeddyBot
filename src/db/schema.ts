import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role').default('user').notNull(),
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
