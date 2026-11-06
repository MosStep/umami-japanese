/**
 * Phase 1: Database Schema (PostgreSQL / Prisma / Supabase & TypeScript Interfaces)
 * Designed according to HayaiLearn Modular Prompt Phase 1 specification.
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type WordLearningStatus = 'new' | 'learning' | 'known';
export type VideoCategory = 'Anime' | 'Vlogs' | 'News' | 'Gaming' | 'Daily Conversation';

export interface JLPTDistribution {
  N5: number;
  N4: number;
  N3: number;
  N2: number;
  N1: number;
}

/**
 * 1. Videos Table Schema
 */
export interface VideoRecord {
  id: string;
  youtube_id: string;
  title: string;
  japanese_title: string;
  channel: string;
  category: VideoCategory;
  difficulty_rating: number; // 1-10 scale
  primary_jlpt: JLPTLevel;
  jlpt_distribution: JLPTDistribution;
  duration: number; // in seconds
  thumbnail_gradient: string;
  scene_emoji: string;
  description: string;
}

/**
 * Token inside SubtitleLines.tokens_json
 */
export interface SubtitleTokenJSON {
  surface: string;            // Surface form in the sentence (e.g., 食べちゃった)
  word_id: string;            // Reference to DictionaryWords.id
  lemma: string;              // Dictionary form (e.g., 食べる)
  reading_kana: string;       // Furigana reading (e.g., たべちゃった)
  romaji: string;             // Hepburn romaji (e.g., tabechatta)
  pitch_accent: string;       // Mora pitch pattern e.g., "LHHLL" or "[2]"
  pitch_morae: { mora: string; high: boolean }[];
  jlpt_level: JLPTLevel;
  part_of_speech: string;     // e.g., "Verb (Ichidan, casual contraction)"
  contextual_meaning: string; // Exact meaning in THIS specific sentence
  thai_meaning?: string;      // Thai contextual meaning
  general_meanings: string[]; // Core dictionary definitions
  grammar_note?: string;      // Optional note on conjugation/contraction (e.g., てしまう -> ちゃう)
}

/**
 * 2. SubtitleLines Table Schema
 */
export interface SubtitleLineRecord {
  id: string;
  video_id: string;
  line_index: number;
  start_time_ms: number;
  end_time_ms: number;
  speaker?: string;
  raw_text: string;
  natural_translation: string;
  thai_translation?: string;
  ai_grammar_summary: string;
  ai_detailed_breakdown: {
    particles: { particle: string; role: string; explanation: string }[];
    conjugations: { form: string; base: string; explanation: string }[];
    nuance_and_slang: string;
    cultural_note?: string;
  };
  tokens_json: SubtitleTokenJSON[];
}

/**
 * 3. DictionaryWords Table Schema
 */
export interface DictionaryWordRecord {
  id: string;
  lemma: string;
  reading_kana: string;
  romaji: string;
  pitch_accent: string;
  pitch_morae: { mora: string; high: boolean }[];
  jlpt_level: JLPTLevel;
  frequency_rank: number;
  part_of_speech: string;
  core_meanings: string[];
}

/**
 * 4. UserWordStates Table Schema
 */
export interface UserWordStateRecord {
  user_id: string;
  word_id: string;
  status: WordLearningStatus;
  xp_viewing: number;
  xp_reading: number;
  xp_listening: number;
  xp_shadowing: number;
  updated_at: string;
}

/**
 * 5. MinedSentences Table Schema
 */
export interface MinedSentenceRecord {
  id: string;
  user_id: string;
  video_id: string;
  subtitle_line_id: string;
  target_word_id: string;
  user_note: string;
  album_id: string;
  srs_interval: number;      // in days
  srs_ease: number;          // e.g., 2.5 default SM-2 ease factor
  srs_repetitions: number;
  next_review_at: string;    // ISO timestamp
  created_at: string;
}

/**
 * Prisma Schema & PostgreSQL / Supabase DDL Reference
 * Included for Phase 1 specification completeness and portable backend deployment.
 */
export const PRISMA_SCHEMA_SPEC = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum WordStatus {
  new
  learning
  known
}

enum JLPTLevel {
  N5
  N4
  N3
  N2
  N1
}

model Video {
  id                String          @id @default(uuid())
  youtube_id        String          @unique
  title             String
  channel           String
  category          String
  difficulty_rating Int             // 1-10
  jlpt_distribution Json            // { N5: 45, N4: 25, N3: 20, N2: 10, N1: 0 }
  duration          Int             // seconds
  subtitle_lines    SubtitleLine[]
  mined_sentences   MinedSentence[]
  created_at        DateTime        @default(now())
}

model SubtitleLine {
  id                  String          @id @default(uuid())
  video_id            String
  video               Video           @relation(fields: [video_id], references: [id], onDelete: Cascade)
  start_time_ms       Int
  end_time_ms         Int
  raw_text            String
  natural_translation String
  ai_grammar_summary  String
  tokens_json         Json            // Array of SubtitleTokenJSON
  mined_sentences     MinedSentence[]

  @@index([video_id, start_time_ms])
}

model DictionaryWord {
  id              String          @id @default(uuid())
  lemma           String          @unique
  reading_kana    String
  romaji          String
  pitch_accent    String
  jlpt_level      JLPTLevel
  frequency_rank  Int
  core_meanings   String[]
  user_states     UserWordState[]
  mined_sentences MinedSentence[]

  @@index([jlpt_level, frequency_rank])
}

model UserWordState {
  user_id      String
  word_id      String
  word         DictionaryWord @relation(fields: [word_id], references: [id], onDelete: Cascade)
  status       WordStatus     @default(new)
  xp_viewing   Int            @default(0)
  xp_reading   Int            @default(0)
  xp_listening Int            @default(0)
  xp_shadowing Int            @default(0)
  updated_at   DateTime       @updatedAt

  @@id([user_id, word_id])
}

model MinedSentence {
  id               String         @id @default(uuid())
  user_id          String
  video_id         String
  video            Video          @relation(fields: [video_id], references: [id], onDelete: Cascade)
  subtitle_line_id String
  subtitle_line    SubtitleLine   @relation(fields: [subtitle_line_id], references: [id], onDelete: Cascade)
  target_word_id   String
  target_word      DictionaryWord @relation(fields: [target_word_id], references: [id])
  user_note        String         @default("")
  album_id         String?
  srs_interval     Float          @default(0)
  srs_ease         Float          @default(2.5)
  next_review_at   DateTime       @default(now())
  created_at       DateTime       @default(now())

  @@index([user_id, next_review_at])
}
`;
