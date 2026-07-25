import { neon } from '@neondatabase/serverless';
import type { Project } from '../types';

const STORAGE_KEY_NEON_URL = 'canvasly_neon_db_url';
const DEFAULT_NEON_DEMO_URL = 'postgres://canvasly_user:npg_demo_secret_key@ep-neon-cloud-canvasly-pooler.us-east-2.aws.neon.tech/canvasly_db?sslmode=require';

export class NeonDatabaseService {
  private static connectionUrl: string = localStorage.getItem(STORAGE_KEY_NEON_URL) || DEFAULT_NEON_DEMO_URL;

  public static getConnectionUrl(): string {
    return this.connectionUrl;
  }

  public static setConnectionUrl(url: string) {
    this.connectionUrl = url.trim();
    localStorage.setItem(STORAGE_KEY_NEON_URL, this.connectionUrl);
  }

  // Helper to execute SQL queries using Neon Serverless client
  public static async executeSql(sqlQuery: string) {
    if (!this.connectionUrl) {
      throw new Error('Neon database connection URL is missing.');
    }
    const sql = neon(this.connectionUrl);
    return await (sql as any)(sqlQuery);
  }

  // Test Neon Database Connection
  public static async testConnection(): Promise<{ success: boolean; message: string; version?: string }> {
    try {
      const sql = neon(this.connectionUrl);
      const result = await sql`SELECT version(), current_database(), now();`;
      if (result && result.length > 0) {
        return {
          success: true,
          message: `Connected to Neon Postgres (${result[0].current_database})`,
          version: String(result[0].version).split(',')[0]
        };
      }
      return { success: false, message: 'No response from Neon Serverless endpoint.' };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to establish connection to Neon Database.'
      };
    }
  }

  // Initialize Canvasly Postgres Schema on Neon
  public static async initializeSchema(): Promise<{ success: boolean; log: string }> {
    try {
      const sql = neon(this.connectionUrl);
      
      await sql`
        CREATE TABLE IF NOT EXISTS canvasly_projects (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          device_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at VARCHAR(100),
          thumbnail TEXT,
          screens_data JSONB NOT NULL,
          connections_data JSONB DEFAULT '[]'::jsonb
        );
      `;

      return {
        success: true,
        log: 'Successfully executed schema initialization script on Neon Postgres.'
      };
    } catch (err: any) {
      return {
        success: false,
        log: `Schema Init Error: ${err?.message || 'Postgres error'}`
      };
    }
  }

  // Save/Sync Single Project to Neon Postgres
  public static async syncProjectToNeon(project: Project): Promise<boolean> {
    try {
      const sql = neon(this.connectionUrl);
      const screensJson = JSON.stringify(project.screens);
      const connectionsJson = JSON.stringify(project.flowConnections);

      await sql`
        INSERT INTO canvasly_projects (id, name, description, device_type, updated_at, thumbnail, screens_data, connections_data)
        VALUES (${project.id}, ${project.name}, ${project.description}, ${project.deviceType}, ${project.updatedAt}, ${project.thumbnail}, ${screensJson}::jsonb, ${connectionsJson}::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = EXCLUDED.updated_at,
          screens_data = EXCLUDED.screens_data,
          connections_data = EXCLUDED.connections_data;
      `;
      return true;
    } catch (err) {
      console.warn('Neon Postgres sync fallback:', err);
      return false;
    }
  }

  // Load All Projects from Neon Postgres
  public static async loadProjectsFromNeon(): Promise<Project[] | null> {
    try {
      const sql = neon(this.connectionUrl);
      const rows = await sql`SELECT * FROM canvasly_projects ORDER BY created_at DESC;`;

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          deviceType: r.device_type || 'responsive',
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || 'Just now',
          thumbnail: r.thumbnail || '',
          screens: Array.isArray(r.screens_data) ? r.screens_data : JSON.parse(r.screens_data || '[]'),
          flowConnections: Array.isArray(r.connections_data) ? r.connections_data : JSON.parse(r.connections_data || '[]'),
          comments: []
        }));
      }
      return null;
    } catch (err) {
      console.warn('Could not fetch from Neon DB:', err);
      return null;
    }
  }
}
