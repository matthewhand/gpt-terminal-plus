/**
 * SessionRegistry
 *
 * Central mapping of session IDs to active SessionDrivers.
 * Provides unified access for lifecycle operations (start, exec, stop, logs).
 *
 * Responsibilities:
 * - Maintain in-memory map of active sessions
 * - Route API calls to the correct driver
 * - Handle cleanup of expired/terminated sessions
 * - Persist session metadata and logs under data/activity/
 */

import { SessionDriver, SessionMeta } from "./SessionDriver";

interface SessionEntry {
  driver: SessionDriver;
  meta: SessionMeta;
}

export class SessionRegistry {
  private sessions: Map<string, SessionEntry> = new Map();

  /** Register a new session */
  register(meta: SessionMeta, driver: SessionDriver) {
    this.sessions.set(meta.id, { driver, meta });
  }

  /** Lookup a session */
  get(id: string): SessionEntry | undefined {
    return this.sessions.get(id);
  }

  /** Stop and remove a session */
  async remove(id: string) {
    const entry = this.sessions.get(id);
    if (entry) {
      await entry.driver.stop(id);
      this.sessions.delete(id);
    }
  }

  /** List all sessions */
  list(): SessionMeta[] {
    return Array.from(this.sessions.values()).map((e) => e.meta);
  }
}
